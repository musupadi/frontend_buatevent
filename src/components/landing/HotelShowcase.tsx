'use client'

import {
  useEffect,
  useState,
} from 'react';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin } from 'react-icons/fi';

interface Hotel {
  id: number
  name: string
  city: string
  rating: number
  image_url: string
  description: string
}

export default function HotelShowcase() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/hotels')
      .then(res => res.json())
      .then(data => {
        setHotels(data.hotels?.slice(0, 6) || [])
        setLoading(false)
      })
      .catch(() => {
        // Fallback data if API fails
        setHotels([
          {
            id: 1,
            name: "L'Eminence Golf & Convention Hotel Lembang",
            city: 'Bandung',
            rating: 4.8,
            image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            description: 'Luxury hotel with complete convention facilities'
          },
          {
            id: 2,
            name: 'Padma Hotel Bandung',
            city: 'Bandung',
            rating: 4.7,
            image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
            description: '5-star hotel with mountain view'
          },
          {
            id: 14,
            name: 'Renaissance Bali Nusa Dua Resort',
            city: 'Bali',
            rating: 4.8,
            image_url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
            description: 'Luxury resort with grand ballroom'
          },
        ])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section id="hotels" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading hotels...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="hotels" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Featured Hotels
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-subtitle"
          >
            Premium meeting venues across Indonesia
          </motion.p>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {hotels.map((hotel, index) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden group cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={hotel.image_url}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold">{hotel.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center text-primary-600 mb-2">
                  <FiMapPin size={16} className="mr-1" />
                  <span className="text-sm font-medium">{hotel.city}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {hotel.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {hotel.description}
                </p>
                <Link
                  href={`/hotels/${hotel.id}`}
                  className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center"
                >
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/hotels" className="btn-primary inline-block">
            View All Hotels
          </Link>
        </div>
      </div>
    </section>
  )
}
