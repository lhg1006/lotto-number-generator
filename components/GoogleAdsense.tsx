'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface GoogleAdsenseProps {
  style?: React.CSSProperties
  className?: string
  client: string
  slot: string
  format?: string
  responsive?: string
  layout?: string
}

const GoogleAdsense = ({ 
  style, 
  className = "", 
  client, 
  slot, 
  format = "auto", 
  responsive = "true",
  layout = "in-article"
}: GoogleAdsenseProps) => {
  const advertRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    try {
      const adsbygoogle = window.adsbygoogle || []
      adsbygoogle.push({})
    } catch (err) {
      console.error('Adsbygoogle error:', err)
    }
  }, [])

  return (
    <ins
      ref={advertRef}
      className={`adsbygoogle ${className}`}
      style={{
        display: 'block',
        width: '100%',
        minHeight: '100px',
        ...style
      }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-ad-layout={layout}
      data-full-width-responsive={responsive}
    />
  )
}

export default GoogleAdsense 