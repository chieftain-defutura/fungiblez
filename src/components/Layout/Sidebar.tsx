import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'

import { Backdrop } from 'components/Modals'
import { useLockedBody, useUpdateEffect } from 'hooks'
import { headerLinks } from 'constants/links'
import { formatLinks } from 'helpers/formatters'

interface ISidebar {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const sidebarLinks = [...headerLinks]

const Sidebar: React.FC<ISidebar> = ({ isOpen, setIsOpen }) => {
  const handleClose = () => setIsOpen(false)
  const { setLocked } = useLockedBody()
  const location = useLocation()

  useUpdateEffect(() => {
    if (isOpen) return setLocked(true)
    return setLocked(false)
  }, [isOpen])

  useUpdateEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <>
      <Backdrop isOpen={isOpen} handleClose={handleClose} />
      <AnimatePresence exitBeforeEnter>
        {isOpen && (
          <motion.div
            className="sidebar"
            onClick={(e) => e.stopPropagation()}
            initial={{ width: 0 }}
            animate={{ width: 280, transition: { duration: 0.4 } }}
            exit={{ width: 0 }}
          >
            <div className="sidebar-box">
              <nav>
                {sidebarLinks.map((link) => (
                  <NavLink key={link} to={`/${formatLinks(link)}`}>
                    {link}
                  </NavLink>
                ))}
                {/* {upcomingLinks.map((link, index) => (
                  <a
                    key={index.toString()}
                    href="/#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.reload();
                    }}
                  >
                    {link}
                  </a>
                ))} */}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default React.memo(Sidebar)
