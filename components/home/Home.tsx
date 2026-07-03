'use client'

import Image from 'next/image'
import React from 'react'
import Navbar from '../shared/Navbar'
import Banner from './Banner'
import DiscountBanner from './DiscountBanner'
import { useHomepageContent } from '@/providers/HomepageContentProvider'
// import FloatingActions from './FloatingActions'

const Home = () => {
  const { content } = useHomepageContent()

  const heroImageUrl =
    content?.heroMedia?.fileUrl ||
    null

  return (
    <div>  {/* Hero Section (Navbar + Banner) */}
      <DiscountBanner />
      <div
        className='px-4 md:px-6'
        style={{ paddingTop: 'max(8px, calc(32px - var(--banner-height, 0px)))' }}
      >
        <div 
          className="relative rounded-3xl md:rounded-4xl overflow-hidden md:min-h-[90vh] lg:h-[905px] w-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            {heroImageUrl ? (
              <Image
                src={heroImageUrl}
                alt="Hero background"
                fill
                priority
                unoptimized={true}
                className="object-cover"
              />
            ) : (
              <Image
                src="/banner/bannerImage.png"
                alt="Woman smiling outdoors"
                fill
                unoptimized={true}
                className="object-cover"
                priority
              />
            )}
            {/* Overlay to improve text readability */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[4px]" />
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