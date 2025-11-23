import Blockchain from '@/components/landing/Blockchain';
import CTA from '@/components/landing/CTA';
import Features from '@/components/landing/Features';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import HotelShowcase from '@/components/landing/HotelShowcase';
import HowItWorks from '@/components/landing/HowItWorks';
import Navbar from '@/components/landing/Navbar';
import Testimonials from '@/components/landing/Testimonials';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HotelShowcase />
      <HowItWorks />
      <Blockchain />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  )
}
