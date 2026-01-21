'use client'

import {
  useEffect,
  useState,
} from 'react';

import Image from 'next/image';
import Link from 'next/link';
import {
  useParams,
  useRouter,
} from 'next/navigation';
import {
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiStar,
} from 'react-icons/fi';

import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';
import { API_ENDPOINTS } from '@/lib/api';

interface Hotel {
  id: number
  name: string
  city: string
  address: string
  rating: number
  description: string
  image_url: string
}

interface RoomType {
  id: number
  hotel_id: number
  name: string
  description: string
  price_per_person: number
  min_capacity: number
  max_capacity: number
}

export default function HotelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const hotelId = params.id as string

  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Helper function to get safe image URL
  const getSafeImageUrl = (url: string | null | undefined): string => {
    if (!url) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'
    
    if (url.includes('?')) return url
    
    if (url.includes('unsplash.com')) {
      return `${url}?w=1200&q=80&fit=crop`
    }
    
    return url
  }

  useEffect(() => {
    Promise.all([
      fetch(API_ENDPOINTS.HOTEL_BY_ID(hotelId)).then((res) => res.json()),
      fetch(API_ENDPOINTS.HOTEL_ROOM_TYPES(hotelId)).then((res) => res.json())
    ])
      .then(([hotelData, roomTypesData]) => {
        console.log('Hotel:', hotelData)
        console.log('Room Types:', roomTypesData)
        
        setHotel(hotelData.hotel || hotelData)
        setRoomTypes(roomTypesData.room_types || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error:', err)
        setError('Failed to load hotel details')
        setLoading(false)
      })
  }, [hotelId])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading hotel details...</p>
          </div>
        </div>
      </>
    )
  }

  if (error || !hotel) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-600 mb-4">{error || 'Hotel not found'}</p>
            <Link href="/hotels" className="btn-primary">
              Back to Hotels
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Image */}
        <div className="relative h-[500px] bg-gray-200">
          <Image
            src={getSafeImageUrl(hotel.image_url)}
            alt={hotel.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Back Button */}
          <Link
            href="/hotels"
            className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-white transition-colors"
          >
            <FiArrowLeft />
            <span>Back to Hotels</span>
          </Link>

          {/* Hotel Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center space-x-2 mb-2">
                <FiMapPin size={20} />
                <span className="text-lg">{hotel.city}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{hotel.name}</h1>
              <p className="text-lg text-white/90 mb-3">{hotel.address}</p>
              <div className="flex items-center space-x-2">
                <FiStar className="text-yellow-400 fill-yellow-400" size={24} />
                <span className="text-2xl font-bold">{hotel.rating.toFixed(1)}</span>
                <span className="text-white/80">/ 5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Description */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Hotel</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{hotel.description}</p>
          </div>

          {/* Book Now Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl shadow-xl p-8 md:p-12 text-white text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Choose from available hotel rooms and meeting rooms. Select multiple rooms with our cinema-style booking interface.
              </p>
              <Link
                href={`/booking/multi?hotel_id=${hotel.id}`}
                className="inline-flex items-center space-x-3 bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg"
              >
                <FiCalendar size={24} />
                <span>Book Now</span>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl shadow-md p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Why Book with BuatEvent?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-2">🔒 Blockchain Security</h3>
                <p className="text-white/90">Your booking is secured on Hyperledger Fabric with immutable records.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">💰 Transparent Pricing</h3>
                <p className="text-white/90">Auto-calculated prices with no hidden fees. What you see is what you pay.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">⚡ Instant Confirmation</h3>
                <p className="text-white/90">Get real-time booking confirmation with smart contract automation.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
