// Discount types

export type DiscountType = 'PERCENTAGE' | 'FIXED'

export interface Discount {
  id: string
  code: string
  type: DiscountType
  value: number
  expiresAt: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DiscountMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface DiscountsResponse {
  data: Discount[]
  meta: DiscountMeta
}
