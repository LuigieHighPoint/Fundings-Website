import '../styles/globals.css'
import { LangProvider } from '../components/LangContext'
import { useEffect } from 'react'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    function handleAnchorClick(e) {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href').slice(1)
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      const elHeight = el.offsetHeight
      const viewHeight = window.innerHeight
      const elTop = el.getBoundingClientRect().top + window.scrollY
      const offset = elHeight < viewHeight
        ? elTop - (viewHeight / 2 - elHeight / 2)
        : elTop - 100
      window.scrollTo({ top: offset, behavior: 'smooth' })
    }
    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [])

  return (
    <LangProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>
      <Component {...pageProps} />
    </LangProvider>
  )
}
