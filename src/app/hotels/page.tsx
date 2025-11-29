'use client'

import {
  useEffect,
  useState,
} from 'react';

import Image from 'next/image';
import { API_ENDPOINTS } from '@/lib/api';
import Link from 'next/link';
import {
  FiFilter,
  FiMapPin,
  FiSearch,
  FiStar,
} from 'react-icons/fi';

import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

interface Hotel {
  id: number
  name: string
  city: string
  address: string
  rating: number
  description: string
  image_url: string
  created_at: string
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('All')

  // Helper function to get safe image URL
  const getSafeImageUrl = (url: string | null | undefined): string => {
    if (!url) return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
    
    // If URL already has query params, use as is
    if (url.includes('?')) return url
    
    // Add default params for Unsplash
    if (url.includes('unsplash.com')) {
      return `${url}?w=800&q=80&fit=crop`
    }
    
    return url
  }

  // Fetch hotels from API
  useEffect(() => {
    fetch(API_ENDPOINTS.HOTELS)
      .then(res => res.json())
      .then(data => {
        console.log('Hotels data:', data)
        const hotelsData = data.hotels || []
        setHotels(hotelsData)
        setFilteredHotels(hotelsData)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching hotels:', err)
        setLoading(false)
      })
  }, [])

  // Get unique cities
  const cities = ['All', ...Array.from(new Set(hotels.map(h => h.city)))]

  // Filter hotels
  useEffect(() => {
    let filtered = hotels

    // Filter by city
    if (selectedCity !== 'All') {
      filtered = filtered.filter(h => h.city === selectedCity)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredHotels(filtered)
  }, [searchQuery, selectedCity, hotels])

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Hotels</h1>
            <p className="text-xl text-white/90">
              Discover {hotels.length} premium meeting venues across Indonesia
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white shadow-md sticky top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search hotels by name, city, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* City Filter */}
              <div className="relative">
                <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredHotels.length} of {hotels.length} hotels
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading hotels...</p>
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No hotels found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCity('All')
                }}
                className="mt-4 btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHotels.map((hotel) => (
                <Link
                  key={hotel.id}
                  href={`/hotels/${hotel.id}`}
                  className="card overflow-hidden group hover:scale-105 transition-transform duration-300"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    <Image
                      src={getSafeImageUrl(hotel.image_url)}
                      alt={hotel.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      priority={false}
                    />
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
                      <FiStar className="text-yellow-500 fill-yellow-500" size={16} />
                      <span className="font-semibold">{hotel.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* City */}
                    <div className="flex items-center text-primary-600 mb-2">
                      <FiMapPin size={16} className="mr-1" />
                      <span className="text-sm font-medium">{hotel.city}</span>
                    </div>

                    {/* Hotel Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {hotel.name}
                    </h3>

                    {/* Address */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                      {hotel.address}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {hotel.description}
                    </p>

                    {/* View Details Button */}
                    <div className="flex items-center text-primary-600 font-semibold group-hover:text-primary-700">
                      View Details & Packages →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
