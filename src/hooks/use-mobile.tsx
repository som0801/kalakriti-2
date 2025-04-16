
import * as React from "react"

// Define breakpoints for different device sizes
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth < BREAKPOINTS.MOBILE : false
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.MOBILE - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    }
    
    // Add event listener for screen size and orientation changes
    mql.addEventListener("change", onChange)
    window.addEventListener("orientationchange", onChange)
    window.addEventListener("resize", onChange)
    
    // Set initial value
    setIsMobile(window.innerWidth < BREAKPOINTS.MOBILE)
    
    // Clean up event listeners
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener("orientationchange", onChange)
      window.removeEventListener("resize", onChange)
    }
  }, [])

  return isMobile
}

export function useDeviceType() {
  const [deviceType, setDeviceType] = React.useState<'mobile' | 'tablet' | 'desktop' | undefined>(undefined)

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < BREAKPOINTS.MOBILE) {
        setDeviceType('mobile')
      } else if (width < BREAKPOINTS.TABLET) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    // Set initial value
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return deviceType
}

// Add touch-specific detection
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState<boolean>(false)
  
  React.useEffect(() => {
    const isTouchDevice = () => {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        // @ts-ignore
        (navigator.msMaxTouchPoints > 0))
    }
    
    setIsTouch(isTouchDevice())
  }, [])
  
  return isTouch
}
