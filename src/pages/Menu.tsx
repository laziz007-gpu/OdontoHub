import React from 'react'
import Doshboard from "../components/Doshboard"
import Render from '../Layouts/Render'
const Menu = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Doshboard />
      <main className="flex-1">
        <Render />
      </main>
    </div>
  )
}

export default Menu