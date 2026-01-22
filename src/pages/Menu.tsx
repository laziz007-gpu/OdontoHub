import React from 'react'
import Doshboard from "../Layouts/Doshboard"
import Render from '../Layouts/Render'
import MobileHeaderAndDrawer from "../Layouts/MobileHeaderAndDrawer"
const Menu = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Doshboard />
      <MobileHeaderAndDrawer/>
      <main className="flex-1">
        <Render />
      </main>
    </div>
  )
}

export default Menu