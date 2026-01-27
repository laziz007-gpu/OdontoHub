import Doshboard from "../components/Doshboard"
import Patsant from '../Layouts/Patsant'

const Odam = () => {
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Doshboard />
      <main className='flex-1'>
        <Patsant />
      </main>
    </div>
  )
}

export default Odam  // ← Bu o'zgartirildi