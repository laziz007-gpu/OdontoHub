import React from 'react'
import Doshboard from "../Layouts/Doshboard"
import MobileHeaderAndDrawer from "../Layouts/MobileHeaderAndDrawer"
import PatientProfile from '../components/PatientProfile'

const PatientProfilePage = () => {
    return (
        <div className='flex min-h-screen bg-gray-50'>
            <Doshboard />
            <MobileHeaderAndDrawer />
            <main className='flex-1'>
                <PatientProfile />
            </main>
        </div>
    )
}

export default PatientProfilePage
