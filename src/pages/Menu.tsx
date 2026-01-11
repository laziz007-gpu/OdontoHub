// pages/Menu.tsx
import React from 'react';
import Hero from '../Layouts/Hero';
import Section from '../Layouts/Section';
import Consultatsiya from '../Layouts/Consultatsiya';
import Patsesionl from '../Layouts/Patsesionl';      // ehtimol Patsesionl → NewPatients
import Tezroq from '../Layouts/Tezroq';

export default function Menu() {
  return (
    <div className="p-6">
      <Hero />

      <div className="flex gap-6">
        {/* Chap qism */}
        <div className="flex-1 space-y-6">
          <Consultatsiya />
          <Patsesionl />   {/* NewPatients */}
          <Tezroq />
        </div>

        {/* O‘ng qism — kichik ekranlarda yashirin bo‘lishi mumkin */}
        <div className="hidden lg:block w-[340px] shrink-0">
          <Section />
        </div>
      </div>
    </div>
  );
}