import React from 'react'
import Doshboard from "../Layouts/Doshboard"
import MobileHeaderAndDrawer from "../Layouts/MobileHeaderAndDrawer"
import Patsant from '../Layouts/Patsant'

const Odam = () => {
  return (
    <div className='flex min-h-screen bg-gray-50'>
        <Doshboard/>
        <MobileHeaderAndDrawer/>
      <main className='flex-1'>
        <Patsant/>
      </main>
    </div>
  )
}

export default Odam  // ← Bu o'zgartirildi