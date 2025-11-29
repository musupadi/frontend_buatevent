'use client'

import {
  useEffect,
  useState,
} from 'react';
import { API_ENDPOINTS } from '@/lib/api';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPackage,
  FiStar,
  FiUsers,
  FiX,
} from 'react-icons/fi';

import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

interface Reservation {
  id: number
  reservation_id: string
  hotel_id: number
  room_type_id: number
  check_in: string
  check_out: string
  guest_count: number
  event_type: string
  event_description: string
  price_per_person: number
  total_price: number
  currency: string
  status: string
  created_at: string
  updated_at: string
  hotel: {
    id: number
    name: string
    city: string
    address: string
    rating: number
  }
  room_type: {
    id: number
    type_name: string
    description: string
  }
}

export default function MyBookingsPage() {
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all') // all, upcoming, past, cancelled

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login?redirect=/my-bookings&message=' + encodeURIComponent('Please login to view your bookings'))
      return
    }

    // Fetch user's reservations
    fetch(API_ENDPOINTS.MY_BOOKINGS, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.reservations) {
          setReservations(data.reservations)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error:', err)
        setError('Failed to load your bookings')
        setLoading(false)
      })
  }, [router])

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, { bg: string; text: string; icon: any }> = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiClock },
      CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FiCheckCircle },
      CHECKED_IN: { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle },
      CHECKED_OUT: { bg: 'bg-gray-100', text: 'text-gray-800', icon: FiCheckCircle },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: FiX },
    }

    const style = statusStyles[status] || statusStyles.PENDING
    const Icon = style.icon

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${style.bg} ${style.text}`}>
        <Icon size={14} />
        <span>{status}</span>
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const filteredReservations = reservations.filter((reservation) => {
    if (filter === 'all') return true
    if (filter === 'cancelled') return reservation.status === 'CANCELLED'
    
    const checkIn = new Date(reservation.check_in)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (filter === 'upcoming') return checkIn >= today && reservation.status !== 'CANCELLED'
    if (filter === 'past') return checkIn < today && reservation.status !== 'CANCELLED'
    
    return true
  })

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage and track your hotel reservations</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({reservations.length})
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'upcoming'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'past'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Past
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'cancelled'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
              <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Reservations List */}
          {filteredReservations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <FiCalendar className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? "You haven't made any bookings yet."
                  : `No ${filter} bookings found.`}
              </p>
              <Link href="/hotels" className="btn-primary inline-block">
                Browse Hotels
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {reservation.hotel.name}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center space-x-1">
                              <FiMapPin size={14} />
                              <span>{reservation.hotel.city}</span>
                              <span className="mx-2">•</span>
                              <FiStar className="text-yellow-500" size={14} />
                              <span>{reservation.hotel.rating.toFixed(1)}</span>
                            </p>
                          </div>
                          {getStatusBadge(reservation.status)}
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                          <FiPackage size={16} />
                          <span className="font-medium">{reservation.room_type.type_name}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2 text-gray-700">
                            <FiCalendar className="text-primary-600" size={16} />
                            <div>
                              <p className="text-xs text-gray-500">Check-in</p>
                              <p className="font-medium">{formatDate(reservation.check_in)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <FiCalendar className="text-primary-600" size={16} />
                            <div>
                              <p className="text-xs text-gray-500">Check-out</p>
                              <p className="font-medium">{formatDate(reservation.check_out)}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <FiUsers className="text-primary-600" size={16} />
                            <div>
                              <p className="text-xs text-gray-500">Guests</p>
                              <p className="font-medium">{reservation.guest_count} people</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:text-right">
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-primary-600">
                          Rp {reservation.total_price.toLocaleString('id-ID')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Booking ID: {reservation.reservation_id}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/reservations/${reservation.reservation_id}`}
                        className="btn-primary text-center flex-1"
                      >
                        View Details
                      </Link>
                      {reservation.status === 'PENDING' && (
                        <button className="btn-secondary flex-1">
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
