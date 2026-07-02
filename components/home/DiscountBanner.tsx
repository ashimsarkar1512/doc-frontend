'use client'

import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useGetDiscountsQuery } from '@/Redux/features/discounts/discountsApi'
import type { Discount } from '@/types/discountTypes'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTimeLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 }
  const s = Math.floor(diff / 1000)
  return { hours: Math.floor(s / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

// ─── DUMMY (module-level — created ONCE, never on re-render) ─────────────────
// Remove this block and set DUMMY_MODE = false to use real API data.
const DUMMY_MODE = true

const DUMMY_DISCOUNT: Discount = {
  id: 'test-1',
  code: 'SUMMER2026',
  value: 10,
  type: 'PERCENTAGE',
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
  updatedAt: '2026-01-01T00:00:00.000Z',
}

// ─── Component ────────────────────────────────────────────────────────────────

const DiscountBanner = () => {
  const { data, isLoading } = useGetDiscountsQuery()
  const bannerRef = useRef<HTMLDivElement>(null)

  const [dismissed, setDismissed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  // Pick the latest active PERCENTAGE coupon from the real API
  const apiDiscount: Discount | null = (() => {
    const list = (data?.data ?? []).filter(
      (d) => d.type === 'PERCENTAGE' && d.isActive
    )
    if (!list.length) return null
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]
  })()

  // Use dummy or real — but the reference is STABLE (not re-created each render)
  const discount: Discount | null = DUMMY_MODE ? DUMMY_DISCOUNT : apiDiscount

  // ─ Countdown timer ──────────────────────────────────────────────────────────
  // Dependency is discount.expiresAt (a string) — stable, no infinite loop.
  const expiresAt = discount?.expiresAt ?? null

  useEffect(() => {
    if (!expiresAt) return
    setTimeLeft(getTimeLeft(expiresAt))
    const id = setInterval(() => {
      const tl = getTimeLeft(expiresAt)
      setTimeLeft(tl)
      if (tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
        clearInterval(id)
        setDismissed(true)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [expiresAt]) // ← string primitive, stable across renders ✓

  // ─ Banner height CSS variable for Navbar offset ──────────────────────────
  useEffect(() => {
    const el = bannerRef.current
    const root = document.documentElement

    if (!el || isLoading || !discount || dismissed) {
      root.style.setProperty('--banner-height', '0px')
      return
    }

    const update = () => {
      root.style.setProperty('--banner-height', `${el.offsetHeight}px`)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      ro.disconnect()
      root.style.setProperty('--banner-height', '0px')
    }
  }, [discount, dismissed, isLoading])

  // Don't render when loading, no discount, or dismissed
  if (isLoading || !discount || dismissed) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(discount.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      ref={bannerRef}
      role="banner"
      aria-label="Promotional discount banner"
      className="relative z-40 flex min-h-[44px] flex-wrap items-center justify-center gap-2.5  text-sm text-black "
    >
      {/* Left decorative line */}
      {/* <span
        aria-hidden
        className="block h-0.5 w-12 shrink-0 rounded-full bg-[linear-gradient(90deg,transparent,#e53e3e)]"
      /> */}

      {/* Message */}
      <span className="whitespace-nowrap font-normal">
        Get UP-TO{' '}
        <strong className="text-[#0E4E45]">{discount.value}% Discount</strong>. Use coupon code{' '}
      </span>

      {/* Coupon code — click to copy */}
      <button
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Click to copy'}
        aria-label={`Copy coupon code ${discount.code}`}
        className="inline-flex cursor-pointer border-none bg-transparent p-0"
      >
        <span className="text-sm font-bold tracking-[0.04em] text-[#1D4ED8] underline underline-offset-[3px]">
          {copied ? 'Copied!' : discount.code}
        </span>
      </button>

      {/* Countdown timer */}
      <span
        aria-live="off"
        className="inline-flex min-w-[92px] shrink-0 items-center justify-center rounded-md bg-[#2563EB] px-2.5 py-[3px] text-[0.8rem] font-semibold tracking-wide [font-variant-numeric:tabular-nums] text-white"
      >
        {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
      </span>

      {/* Right decorative line */}
      {/* <span
        aria-hidden
        className="block h-0.5 w-12 shrink-0 rounded-full bg-[linear-gradient(90deg,#e53e3e,transparent)]"
      /> */}

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Close discount banner"
        className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer rounded-full border-none bg-transparent p-1 text-white opacity-70 transition-opacity duration-150 hover:opacity-100"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default DiscountBanner
