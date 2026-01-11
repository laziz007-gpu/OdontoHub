import React from 'react'
import Header from '../components/Header'
import Hero from '../Layouts/Hero'
import Section from '../Layouts/Section'
import Consultatsiya from '../Layouts/Consultatsiya'
import Patsesionl from '../Layouts/Patsesionl'
import Tezroq from '../Layouts/Tezroq'
export default function Menu() {
  return (
    <div className="flex min-h-screen bg-[#F0F3FF]">
      <Header />

      <main className="flex-1">
        <Hero />

        <div className="p-6">
          <div className="flex gap-6">
            {/* LEFT */}
            <div className="flex-1 space-y-6">
              <Consultatsiya />
              <Patsesionl />
              <Tezroq/>
            </div>

            {/* RIGHT */}
            <div className="w-[340px] shrink-0">
              <Section />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
