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

export const HomepageContentProvider = ({ 
  children,
  initialData 
}: { 
  children: React.ReactNode;
  initialData?: HomepageContent 
}) => {
  const { data, isLoading } = useGetHomepageContentQuery(undefined, { 
    refetchOnFocus: true, 
    refetchOnMountOrArgChange: true 
  })

  // Use initialData instantly while client-side fetch happens in background
  const content = data || initialData;
  const loading = !content && isLoading;

  return (
    <HomepageContext.Provider value={{ content, isLoading: loading }}>
      {children}
    </HomepageContext.Provider>
  )
}

export const useHomepageContent = () => useContext(HomepageContext)
