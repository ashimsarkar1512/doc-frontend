import Image from 'next/image'
import React from 'react'
import Navbar from '../shared/Navbar'
import Banner from './Banner'

const Home = () => {
  return (
    <div>  {/* Hero Section (Navbar + Banner) */}
      <div>
        <div className="relative rounded-4xl overflow-hidden min-h-[90vh]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/banner /bannerImage.png"
              alt="Woman smiling outdoors"
              fill
              className="object-cover"
              priority
            />
          </div>

          <Navbar />
          <Banner />
        </div>
      </div>
</div>
  )
}

export default Home