import { useState } from 'react';
import Hero from '../components/Bosh sahifa/Hero'
import NewPatients from '../components/Bosh sahifa/NewPatients'
import Analytics from '../components/Bosh sahifa/Analytics'
import PatientSearch from "../components/Bosh sahifa/PatientSearch"
import Tezroq from '../components/Bosh sahifa/Tezroq'
import Section from '../components/Bosh sahifa/Section'

const Render = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      {/* Hero qismi - to'liq kenglikda, padding yo'q */}
      <Hero onSearch={setSearchQuery} />

      {/* Asosiy kontent */}
      <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Asosiy grid - mobilda 1 ustun, lg dan boshlab 12 ustun grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">

        {/* Chap tomon (asosiy kontent) */}
        <div className="xl:col-span-8 flex flex-col space-y-4 sm:space-y-6 min-w-0">
          <Analytics />
          <NewPatients />
          <PatientSearch searchQuery={searchQuery} />
          <Tezroq />
        </div>

        {/* O'ng tomon (sidebar yoki Section) */}
        <div className="xl:col-span-4 min-w-0">
          <Section />
        </div>

      </div>
      </div>
    </div>
  )
}

export default Render
