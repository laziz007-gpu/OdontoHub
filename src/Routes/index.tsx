import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Section from '../components/Section'

const index = () => {
  return (
   <div className="flex min-h-screen bg-[#F0F3FF]">
      {/* Sidebar / Header */}
      <Header />

      {/* Asosiy kontent */}
      <main className="flex-1  ">
        <Hero />
        <Section/>
      </main>
    </div>
  )
}

export default index