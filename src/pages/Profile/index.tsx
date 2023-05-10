import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'

import './Profile.scss'
import { Button, CopyText } from 'components'
import { getEllipsisTxt } from 'helpers/formatters'

import heroImage from 'assets/abstracts/card.png'
import bg from 'assets/abstracts/bg.png'
import { ReactComponent as ShareIcon } from 'assets/icons/share.svg'
import MyNfts from './MyNfts'

import { useAccount } from 'wagmi'
import OnSaleNfts from './OnSaleNfts'

const profileLinks = [
  {
    name: 'Items',
    link: '/profile/',
  },
  {
    name: 'On sale',
    link: '/profile/onsale',
  },
]

const Profile: React.FC<{}> = () => {
  const { address } = useAccount()

  const renderProfile = (
    <div className="profile_route-details">
      <div className="banner">
        <img src={bg} alt="banner" />
      </div>
      <div className="mx pad">
        <div className="user_details">
          <img className="avatar" src={heroImage} alt="avatar" />
          <div className="flex g-16">
            <div className="flex g-5">
              <p>{getEllipsisTxt(address as string)}</p>
              <CopyText text={address as string} />
            </div>
            <p>Joined July 2022 </p>
          </div>
          <div className="controls">
            <Button variant="secondary">
              <span>Share</span>
              <ShareIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="profile_route">
      {renderProfile}

      <div className="profile_pages">
        <div className="mx pad">
          <nav className="profile_pages-links mb-40">
            {profileLinks.map((path, i) => (
              <NavLink key={i.toString()} to={`${path.link}`}>
                {path.name}
              </NavLink>
            ))}
          </nav>
          <Routes>
            <Route path="/" element={<MyNfts />} />
            <Route path="/onsale" element={<OnSaleNfts />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Profile
