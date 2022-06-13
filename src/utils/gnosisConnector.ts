import { Web3Provider } from '@ethersproject/providers'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'
import SafeAppsSDK, { SafeInfo, Opts as SafeOpts } from '@gnosis.pm/safe-apps-sdk'
import { getAddress } from 'ethers/lib/utils'
import { Chain, Connector, ConnectorNotFoundError } from 'wagmi'

const __IS_SERVER__ = typeof window === 'undefined'

type SafeConnectOptions = SafeOpts & {
  doNotAutoConnect?: boolean
}

export class GnosisConnector extends Connector<SafeAppProvider, SafeConnectOptions | undefined> {
  readonly id = 'gnosis'
  readonly name = 'Gnosis'
  ready = !__IS_SERVER__

  provider?: SafeAppProvider
  sdk = new SafeAppsSDK({})
  safe?: SafeInfo

  constructor(config: { chains?: Chain[]; options?: SafeConnectOptions }) {
    super({ ...config, options: config?.options })
    this.isSafeApp()
      .then((isSafeApp) => {
        if (isSafeApp) {
          this.ready = true
          // Auto connect on safe environment
          if (config.options?.doNotAutoConnect) {
            return
          }
          this.connect()
        }
      })
      .catch((error: any) => {
        console.error(error)
      })
  }

  async connect() {
    const runningAsSafeApp = await this.isSafeApp()

    if (!runningAsSafeApp) {
      throw new Error("You're not running in a Gnosis Safe APP")
    }

    const provider = await this.getProvider()
    if (provider.on) {
      provider.on('accountsChanged', this.onAccountsChanged)
      provider.on('chainChanged', this.onChainChanged)
      provider.on('disconnect', this.onDisconnect)
    }

    const account = await this.getAccount()
    const id = await this.getChainId()

    return {
      account,
      provider,
      chain: { id, unsupported: !runningAsSafeApp },
    }
  }

  async disconnect() {
    const provider = await this.getProvider()
    if (!provider?.removeListener) return

    provider.removeListener('accountsChanged', this.onAccountsChanged)
    provider.removeListener('chainChanged', this.onChainChanged)
    provider.removeListener('disconnect', this.onDisconnect)
  }

  async getAccount() {
    if (!this.safe) {
      throw new ConnectorNotFoundError()
    }

    return getAddress(this.safe.safeAddress)
  }

  async getChainId() {
    if (!this.provider) {
      throw new ConnectorNotFoundError()
    }

    return this.provider.chainId
  }

  async getSafeInfo(): Promise<SafeInfo> {
    if (!this.sdk) {
      throw new ConnectorNotFoundError()
    }
    if (!this.safe) {
      this.safe = await this.sdk.safe.getInfo()
    }
    return this.safe
  }

  async isSafeApp(): Promise<boolean> {
    if (__IS_SERVER__) {
      return false
    }

    // check if we're in an iframe
    if (window?.parent === window) {
      return false
    }
    const safe = await Promise.race([
      this.getSafeInfo(),
      new Promise<void>((resolve) => setTimeout(resolve, 300)),
    ])
    return !!safe
  }

  getProvider() {
    if (!this.provider) {
      const safe = this.safe
      if (!safe || !this.sdk) {
        throw new Error('Could not load Safe information')
      }
      this.provider = new SafeAppProvider(safe, this.sdk)
    }

    return Promise.resolve(this.provider)
  }

  async getSigner() {
    const provider = await this.getProvider()
    const account = await this.getAccount()
    return new Web3Provider(<SafeAppProvider>(<unknown>provider)).getSigner(account)
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount()
      return !!account
    } catch {
      return false
    }
  }

  protected onAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) this.emit('disconnect')
    else this.emit('change', { account: getAddress(accounts[0]) })
  }

  protected isChainUnsupported(chainId: number) {
    return !this.chains.some((x) => x.id === chainId)
  }

  protected onChainChanged(chainId: string | number) {
    const id = Number(chainId)
    const unsupported = this.isChainUnsupported(id)
    this.emit('change', { chain: { id, unsupported } })
  }

  protected onDisconnect() {
    this.emit('disconnect')
  }
}
