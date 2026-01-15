import React from 'react'
import Header from "../components/Header"
import Hero from "../components/Hero"
import Patsesionl from "../components/Patsesionl"
import Tezroq from "../components/Tezroq"
import Section from "../components/Section"

const Menu = () => {
  return (
    <div className="min-h-screen bg-[#F4F7FE] flex">
      <Header />
      <main className="flex-1 px-6 py-6 overflow-auto">
        <Hero />
        <div className="mt-6 flex gap-6">
          <div className="flex-1 space-y-6">
            <Patsesionl />
            <Tezroq />
          </div>
          <aside className="hidden xl:block w-[380px] shrink-0">
            <Section />
          </aside>
        </div>
      </main>
    </div>
  )
}

export default Menu