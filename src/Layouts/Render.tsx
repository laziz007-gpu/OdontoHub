import React from 'react'
import Hero from '../components/Hero'
import Consultatsiya from '../components/Consultatsiya'
import Patsent from "../components/Patsent"
import Tezroq from '../components/Tezroq'
import Section from '../components/Section'

const Render = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      
      {/* Hero qismi - to'liq kenglikda */}
      <div className="mb-6 max-lg:pt-11">
        <Hero />
      </div>

      {/* Asosiy grid - mobilda 1 ustun, lg dan boshlab 12 ustun grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chap tomon (asosiy kontent) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <Consultatsiya />
          <Patsent />
          <Tezroq />
        </div>

        {/* O'ng tomon (sidebar yoki Section) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <Section />
        </div>

      </div>
    </div>
  )
}

export default Render
