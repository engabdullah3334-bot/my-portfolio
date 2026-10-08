import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'aa_cv_downloads'

/**
 * Tracks CV download clicks in localStorage.
 * Replace with a real API call (e.g. countapi.xyz) when you have a domain.
 */
export function useDownloadAnalytics() {
  const [downloadCount, setDownloadCount] = useState(0)
  const [justDownloaded, setJustDownloaded] = useState(false)

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10)
    setDownloadCount(stored)
  }, [])

  const trackDownload = useCallback(() => {
    setDownloadCount((prev) => {
      const next = prev + 1
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
    setJustDownloaded(true)
    setTimeout(() => setJustDownloaded(false), 2500)
  }, [])

  return { downloadCount, trackDownload, justDownloaded }
}
