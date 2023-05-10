import React from 'react'

import './Header.scss'
import logo from 'assets/logo/logo.svg'
import { ReactComponent as Twitter } from 'assets/icons/twitter.svg'
import { ReactComponent as Github } from 'assets/icons/github.svg'
import { ReactComponent as Medium } from 'assets/icons/medium.svg'
import { ReactComponent as Docs } from 'assets/icons/folder.svg'
import { ReactComponent as Telegram } from 'assets/icons/telegram.svg'
import { footerlinks } from 'constants/links'

const Footer = () => {
  return (
    <div className="footer">
      <div className="pad">
        <div className="footer_logo">
          <img src={logo} alt="logo" />
          <p>
            The world’s first and largest digital marketplace for crypto
            collectibles and non-fungible tokens (NFTs). Buy, sell, and discover
            exclusive digital items.
          </p>
        </div>
        <nav>
          <ul className="links">
            {footerlinks.map((link, index) => (
              <li key={index.toString()}>
                <a href={link.to} target="_blank" rel="noopener noreferrer">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex g-32">
            <a
              className="social_icon"
              href="https://t.me/UngibleZ_Ann"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Telegram />
            </a>
            <a
              className="social_icon"
              href="https://twitter.com/ungiblez_"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter />
            </a>
            <a
              className="social_icon"
              href="https://medium.com/@UngibleZ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Medium />
            </a>
            <a
              className="social_icon"
              href="https://github.com/UngibleZ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github />
            </a>
            <a
              className="social_icon"
              href="https://docs.ungiblez.live/guides/introduction"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Docs />
            </a>
            <a
              className="social_icon"
              href="https://t.me/UngibleZ_chat"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Telegram />
            </a>
          </div>
        </nav>
        <section className="copyrights">Copyright 2022 UngibleZ</section>
      </div>
    </div>
  )
}

export default React.memo(Footer)
