'use client'

import React, { createContext, useContext } from 'react'
import { useGetHomepageContentQuery } from '@/Redux/features/homepageContent/homepageContentApi'
import type { HomepageContent } from '@/Redux/features/homepageContent/homepageContentApi'

interface HomepageContextValue {
  content: HomepageContent | undefined
  isLoading: boolean
}

const HomepageContext = createContext<HomepageContextValue>({
  content: undefined,
  isLoading: true,
})

export const HomepageContentProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useGetHomepageContentQuery()
  return (
    <HomepageContext.Provider value={{ content: data, isLoading }}>
      {children}
    </HomepageContext.Provider>
  )
}

export const useHomepageContent = () => useContext(HomepageContext)
