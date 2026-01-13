'use client'

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

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
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        // Redirect based on role
        if (user.role === 'hotel_super_admin' || user.role === 'hotel_admin') {
          router.push('/hotel-admin')
        } else {
          router.push('/hotels')
        }
      } catch (err) {
        console.error('Failed to parse user data:', err)
      }
    }
  }, [router])

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
