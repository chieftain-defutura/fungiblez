import React, { Fragment, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDarkMode } from 'usehooks-ts'
import { Web3Button } from '@web3modal/react'

import './Header.scss'
import logo from 'assets/logo/logo.svg'
import { ReactComponent as Menu } from 'assets/icons/menu.svg'
import { ReactComponent as SunIcon } from 'assets/icons/sun.svg'
import { ReactComponent as MoonIcon } from 'assets/icons/moon.svg'
import { ReactComponent as Close } from 'assets/icons/close.svg'
import { formatLinks } from 'helpers/formatters'
import { headerLinks } from 'constants/links'
import Sidebar from './Sidebar'

const Header: React.FC<{
  setOpenBanner: React.Dispatch<React.SetStateAction<boolean>>
  openBanner: boolean
}> = ({ setOpenBanner, openBanner }) => {
  const [sidebar, setSidebar] = useState(false)

  const { toggle, isDarkMode } = useDarkMode()

  const renderNavigation = (
    <div className="navigation_controls">
      <nav>
        <NavLink to={`/`}>Home</NavLink>
        {headerLinks.map((link) => (
          <NavLink key={link} to={`/${formatLinks(link)}`}>
            {link}
          </NavLink>
        ))}
      </nav>
      <div className="theme-switcher" onClick={() => toggle()}>
        {isDarkMode ? <MoonIcon /> : <SunIcon />}
      </div>

      <Web3Button />
      <div className="hamburger" onClick={() => setSidebar(true)}>
        <Menu />
      </div>
    </div>
  )

  const renderBanner = (
    <div className="header_banner pad">
      <h2>UngibleZ platform is on beta version</h2>
      <div className="close" onClick={() => setOpenBanner(false)}>
        <Close />
      </div>
    </div>
  )

  return (
    <Fragment>
      <header className="header">
        {openBanner && renderBanner}
        <div className="header_wrapper pad">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
          </div>
          {renderNavigation}
        </div>
      </header>
      <Sidebar isOpen={sidebar} setIsOpen={setSidebar} />
    </Fragment>
  )
}

export default React.memo(Header)
