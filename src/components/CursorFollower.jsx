import { useEffect, useRef, useState } from 'react'

/**
 * Custom cursor follower — dot (fast) + ring (laggy).
 * Only activates on fine-pointer (mouse) devices, hidden on touch/mobile.
 */
export default function CursorFollower() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    let raf
    let mx = -200, my = -200
    let dx = -200, dy = -200
    let rx = -200, ry = -200
    let hovering = false

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (!visible) setVisible(true)
    }

    const onOver = (e) => {
      hovering = !!e.target.closest('a, button, [role="button"], input, textarea')
    }

    const tick = () => {
      dx += (mx - dx) * 0.85
      dy += (my - dy) * 0.85
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1

      if (dotRef.current) {
        dotRef.current.style.left = `${dx}px`
        dotRef.current.style.top  = `${dy}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left      = `${rx}px`
        ringRef.current.style.top       = `${ry}px`
        ringRef.current.style.transform = `translate(-50%,-50%) scale(${hovering ? 2.2 : 1})`
        ringRef.current.style.opacity   = hovering ? '0.7' : '0.35'
        ringRef.current.style.borderColor = hovering
          ? 'rgba(0,212,255,0.9)'
          : 'rgba(0,212,255,0.5)'
      }
      raf = requestAnimationFrame(tick)
    }

    // Hide native cursor
    document.documentElement.classList.add('custom-cursor-active')

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Fast dot */}
      <div
        ref={dotRef}
        className={`
          fixed z-[9999] w-2 h-2 rounded-full bg-cyber-cyan pointer-events-none
          hidden lg:block transition-opacity duration-300
          ${visible ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          transform: 'translate(-50%,-50%)',
          boxShadow: '0 0 8px rgba(0,212,255,0.9)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Slow lagging ring */}
      <div
        ref={ringRef}
        className={`
          fixed z-[9998] w-10 h-10 rounded-full border pointer-events-none
          hidden lg:block transition-[transform,opacity,border-color] duration-200
          ${visible ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          transform: 'translate(-50%,-50%)',
          borderColor: 'rgba(0,212,255,0.4)',
          mixBlendMode: 'screen',
        }}
      />
    </>
  )
}
