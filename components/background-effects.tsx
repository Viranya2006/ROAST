"use client"

export function BackgroundEffects() {
  return (
    <>
      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] animate-noise"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }}
        aria-hidden="true"
      />
      
      {/* Scanline overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-40 overflow-hidden opacity-[0.015]"
        aria-hidden="true"
      >
        <div 
          className="absolute left-0 right-0 h-[200vh] animate-scanline"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.5) 2px, rgba(255, 255, 255, 0.5) 4px)'
          }}
        />
      </div>

      {/* Subtle vignette effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)'
        }}
        aria-hidden="true"
      />
    </>
  )
}
