import React from 'react'
import styled from 'styled-components'

import { Inner } from '../Header'

const FooterLinks = styled.div`
  font-weight: 400;
  font-size: 13px;
  letter-spacing: 0.015em;
  text-transform: uppercase;
  color: #e0e0e0;
`

const FooterLogo = styled.div`
  color: #696969;
`
const Wrapper = styled.footer`
  width: 100%;
  min-height: 203px;
  border: 1px solid rgba(213, 213, 213, 0.1);
`

export const Footer: React.FC = ({ ...restProps }) => {
  return (
    <Wrapper {...restProps} className="flex pt-10">
      <Inner className="fullPage">
        <div className="py-10 mt-5 footer text-neutral-content">
          <FooterLogo className="grid-flow-col items-center text-2xl font-medium">
            <svg
              fill="none"
              height="28"
              viewBox="0 0 245 28"
              width="245"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M119.193 27.3337H113.649V0H133.225V4.70244H119.193V11.2779H131.082V16.02H119.193V27.3337ZM135.928 5.89765e-05H141.127V4.6627H135.928V5.89765e-05ZM141.127 7.72266H135.928V27.334H141.127V7.72266ZM149.678 10.3974C151.015 8.2942 152.813 7.18701 155.487 7.18701C159.539 7.18701 162.253 10.2466 162.269 14.5204V27.3261H157.071V15.2823C157.071 13.1989 155.848 11.7108 153.666 11.7108C151.38 11.7108 149.698 13.5442 149.698 16.2228V27.3341H144.495V7.72277H149.563V10.3974H149.678ZM182.126 24.4291V14.4488C182.126 9.86149 179.745 7.22656 173.868 7.22656C168.134 7.22656 165.574 10.2464 165.419 13.6869H170.046C170.197 11.8138 171.384 10.9329 173.828 10.9329C176.011 10.9329 177.118 11.8496 177.118 13.2663C177.118 14.7544 175.626 15.0242 172.356 15.4805C167.991 16.0956 164.483 17.4648 164.483 21.7902C164.483 25.691 167.312 27.7942 171.324 27.7942C174.689 27.7942 176.086 26.6474 177.098 25.1553H177.174C177.289 26.0323 177.479 26.953 177.785 27.3339H182.793V27.1434C182.356 26.7982 182.126 25.9331 182.126 24.4291ZM177.233 20.4132C177.233 22.3259 175.59 24.1593 172.606 24.1593C170.773 24.1593 169.546 23.5124 169.546 21.6751C169.546 19.8378 170.888 19.2307 173.602 18.6156L173.802 18.5687L173.892 18.5475C175.107 18.2634 176.384 17.9647 177.233 17.4687V20.4132ZM190.631 10.3974C191.968 8.2942 193.766 7.18701 196.441 7.18701C200.496 7.18701 203.226 10.2466 203.226 14.5204V27.3261H198V15.2823C198 13.1989 196.778 11.7108 194.599 11.7108C192.314 11.7108 190.631 13.5442 190.631 16.2228V27.3341H185.433V7.72277H190.516V10.3974H190.631ZM215.397 23.7388C212.222 23.7388 210.734 21.2547 210.734 17.5483C210.734 13.7625 212.321 11.3537 215.472 11.3537C216.334 11.3435 217.17 11.6426 217.83 12.1967C218.49 12.7508 218.929 13.5233 219.067 14.3736H224.151C223.464 10.1315 220.329 7.18701 215.246 7.18701C209.293 7.18701 205.456 11.699 205.456 17.5483C205.456 23.3976 209.317 27.9055 215.512 27.9055C220.75 27.9055 224 24.5801 224.345 20.4134H219.333C218.992 22.6317 217.512 23.7388 215.397 23.7388ZM230.778 19.0007C231.159 22.0206 232.841 23.8937 235.786 23.8937C237.814 23.8937 238.996 22.977 239.572 21.4809H244.695C243.968 24.9611 240.869 27.9016 235.826 27.9016C229.325 27.9016 225.655 23.3103 225.655 17.5047C225.655 11.699 229.591 7.18708 235.326 7.18708C241.635 7.18708 245 12.0046 245 19.0007H230.778ZM239.556 15.4014C239.401 12.9173 237.77 11.1951 235.389 11.1951L235.405 11.1991C232.651 11.1991 231.314 12.8379 230.825 15.4014H239.556ZM12.0041 7.59613e-05H0V27.3337H5.73418V17.4328H12.4803C18.2145 17.4328 21.6074 13.9526 21.6074 8.78982C21.6292 7.64133 21.4242 6.49982 21.004 5.43072C20.5839 4.36161 19.9569 3.38595 19.159 2.55961C17.5478 0.916734 15.1788 7.59613e-05 12.0041 7.59613e-05ZM11.4684 12.9209H5.73418V4.81358H11.5438C14.2978 4.81358 15.9089 6.26999 15.9089 8.82955C15.9049 11.2978 14.3732 12.9209 11.4684 12.9209ZM42.8971 17.5444C42.8971 23.3937 38.7304 27.9057 32.651 27.9057C26.5715 27.9057 22.4048 23.3897 22.4048 17.5444C22.4048 11.6991 26.5715 7.18709 32.651 7.18709C38.7304 7.18709 42.8971 11.6951 42.8971 17.5444ZM37.6192 17.5444C37.6192 13.7229 35.8256 11.1237 32.651 11.1237C29.4406 11.1237 27.6787 13.7189 27.6787 17.5444C27.6787 21.3698 29.4803 23.9294 32.651 23.9294C35.8216 23.9294 37.6192 21.3659 37.6192 17.5444ZM56.3608 12.194H56.4758V7.64241C56.0797 7.51779 55.6641 7.46663 55.2496 7.49157C52.956 7.49157 51.6186 8.6384 50.4361 10.8567H50.321V7.72573H45.313V27.337H50.5115V17.7775C50.5115 13.6465 52.956 11.8488 56.3608 12.194ZM70.4531 17.5047C70.4531 11.699 74.3897 7.18709 80.1238 7.18709C86.4334 7.18709 89.7986 12.0046 89.7986 18.9968H75.5762C75.9571 22.0166 77.6397 23.8897 80.5842 23.8897C82.612 23.8897 83.7945 22.969 84.3699 21.4809H89.493C88.7668 24.9571 85.6676 27.9017 80.6239 27.9017C74.1238 27.9017 70.4531 23.3103 70.4531 17.5047ZM80.2032 11.1991C77.4492 11.1991 76.1119 12.846 75.6516 15.4055H84.3699C84.2152 12.9214 82.5842 11.1991 80.2032 11.1991ZM97.4016 17.7744C97.4016 13.6473 99.8501 11.8497 103.251 12.1949H103.366V7.6433C102.971 7.5189 102.557 7.46774 102.144 7.49245C99.85 7.49245 98.5127 8.63928 97.3262 10.8576H97.2111V7.72662H92.2031V27.3379H97.4016V17.7744ZM61.0364 1.60701H66.1198V7.64676H69.4691V12.3055H66.1198V27.3335H61.0364V12.3055H58.207V7.64676H61.0364V1.60701Z"
                fill="#696969"
                fillRule="evenodd"
              />
            </svg>
          </FooterLogo>
          <FooterLinks className="grid-flow-col gap-4 md:justify-self-end md:place-self-center">
            <a href="https://docs.porter.finance/portal/faq">Faq</a>
            <a href="https://medium.com/@porterfinance_">Blog</a>
            <a href="https://docs.porter.finance">Docs</a>
            <a href="https://discord.gg/mx8tsEaNut">Discord</a>
            <a href="https://twitter.com/porterfinance_">Twitter</a>
            <a href="https://github.com/orgs/porter-finance/">Github</a>
          </FooterLinks>
        </div>
      </Inner>
    </Wrapper>
  )
}
