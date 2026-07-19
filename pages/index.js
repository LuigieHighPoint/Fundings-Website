import Head from 'next/head'
import { useReveal } from '../components/useReveal'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import QuickQuote from '../components/QuickQuote'
import Programs from '../components/Programs'
import HowItWorks from '../components/HowItWorks'
import Compare from '../components/Compare'
import Benefits from '../components/Benefits'
import Meet from '../components/Meet'
import FAQ from '../components/FAQ'
import Areas from '../components/Areas'
import { CTA, Footer } from '../components/CTAFooter'

export default function Home() {
  useReveal()

  return (
    <>
      <Head>
        <title>High Point Fundings — Private Real Estate Investor Loans | highpointfundings.com</title>
      </Head>

      <Navbar />
      <Hero />
      <QuickQuote />
      <Programs />
      <HowItWorks />
      <Compare />
      <Benefits />
      <Meet />
      <FAQ />
      <Areas />
      <CTA />
      <Footer />
    </>
  )
}
