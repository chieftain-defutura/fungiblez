import React, { Fragment, useLayoutEffect, useState } from 'react'
import { SkeletonTheme } from 'react-loading-skeleton'
import { Route, Routes } from 'react-router-dom'
import { useDarkMode } from 'usehooks-ts'

import { Footer, Header } from './components'
import { Home, Create, Profile, PageNotFound, Marketplace } from './pages'
import NftDetailsPage from 'pages/NftDetails'

const App: React.FC = () => {
  const { isDarkMode } = useDarkMode()
  const [openBanner, setOpenBanner] = useState(true)

  useLayoutEffect(() => {
    if (isDarkMode) {
      document.body.className = 'dark'
    } else {
      document.body.className = 'light'
    }
  }, [isDarkMode])

  return (
    <div className={openBanner ? 'app add' : 'app remove'}>
      <SkeletonTheme
        baseColor={isDarkMode ? '#0a0a0a' : '#eeeeee'}
        highlightColor={isDarkMode ? '#252525' : '#f5f5f5'}
      >
        <Header openBanner={openBanner} setOpenBanner={setOpenBanner} />
        <Routes>
          <Fragment>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="*" element={<PageNotFound />} />
            {/* <Route path="/details" element={<Details />} /> */}
            <Route path="/nftdetails/:id" element={<NftDetailsPage />} />
          </Fragment>
        </Routes>
        <Footer />
      </SkeletonTheme>
    </div>
  )
}

export default App
