import Image from 'next/image'
import React from 'react'
import Navbar from '../shared/Navbar'
import Banner from './Banner'
// import FloatingActions from './FloatingActions'

const Home = () => {
  return (
    <div>  {/* Hero Section (Navbar + Banner) */}
      <div className='px-4 md:px-6 pt-8 md:pt-7'>
        <div className="relative rounded-4xl overflow-hidden min-h-[90vh]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/banner/bannerImage.png"
              alt="Woman smiling outdoors"
              fill
              className="object-cover"
              priority
            />
          </div>

          <Navbar />
          <Banner />
          {/* <FloatingActions /> */}
        </div>
      </div>
</div>
  )
}

export default Home