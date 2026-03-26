import { useState } from 'react';
import Hero from '../components/Bosh sahifa/Hero'
import Analytics from '../components/Bosh sahifa/Analytics'
import Patsent from "../components/Bosh sahifa/Patsent"
import PatientSearch from "../components/Bosh sahifa/PatientSearch"
import Tezroq from '../components/Bosh sahifa/Tezroq'
import Section from '../components/Bosh sahifa/Section'

const Render = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

      {/* Hero qismi - to'liq kenglikda */}
      <div className="mb-6 max-lg:pt-16">
        <Hero onSearch={setSearchQuery} />
      </div>

      {/* Asosiy grid - mobilda 1 ustun, lg dan boshlab 12 ustun grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Chap tomon (asosiy kontent) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <Analytics />
          <PatientSearch searchQuery={searchQuery} />
          <Patsent searchQuery={searchQuery} />
          <Tezroq />
        </div>

        {/* O'ng tomon (sidebar yoki Section) */}
        <div className="lg:col-span-4">
          <Section />
        </div>

      </div>
    </div>
  )
}

export default Render
