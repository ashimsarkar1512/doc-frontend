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
        <div className="relative rounded-4xl overflow-hidden min-h-[90vh]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            {heroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImageUrl}
                alt="Hero background"
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src="/banner/bannerImage.png"
                alt="Woman smiling outdoors"
                fill
                className="object-cover"
                priority
              />
            )}
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