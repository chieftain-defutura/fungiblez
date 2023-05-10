import React from 'react'

import './Home.scss'
import Hero from './components/Hero'

const Home: React.FC = () => {
  return (
    <div className="home">
      <div className="mx pad">
        <Hero />
      </div>
    </div>
  )
}

export default Home
