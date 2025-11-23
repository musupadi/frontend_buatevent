'use client'

import {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiHome,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiShield,
  FiUser,
  FiUsers,
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
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_ref: string
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
  }
  room_type: {
    id: number
    type_name: string
    description: string
  }
}

export default function ReservationDetailPage() {
  const params = useParams()
  const reservationId = params.id as string

  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!reservationId) return

    fetch(`http://localhost:8080/api/v1/reservations/${reservationId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.reservation) {
          setReservation(data.reservation)
        } else {
          setError('Reservation not found')
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error:', err)
        setError('Failed to load reservation details')
        setLoading(false)
      })
  }, [reservationId])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading reservation details...</p>
          </div>
        </div>
      </>
    )
  }

  if (error || !reservation) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <FiAlertCircle className="mx-auto text-red-600 mb-4" size={48} />
            <p className="text-xl text-red-600 mb-4">{error || 'Reservation not found'}</p>
            <Link href="/hotels" className="btn-primary">
              Back to Hotels
            </Link>
          </div>
        </div>
      </>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      CHECKED_IN: 'bg-green-100 text-green-800',
      CHECKED_OUT: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Message */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-start space-x-4">
              <FiCheckCircle className="flex-shrink-0 mt-1" size={32} />
              <div>
                <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
                <p className="text-green-50 mb-4">
                  Your reservation has been successfully recorded on the Hyperledger Fabric blockchain.
                </p>
                <div className="bg-white/20 rounded-lg px-4 py-3 inline-flex items-center space-x-2">
                  <FiShield size={20} />
                  <span className="font-mono font-semibold">{reservation.reservation_id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Reservation Status</h2>
              {getStatusBadge(reservation.status)}
            </div>
          </div>

          {/* Hotel & Package Details */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Details</h2>
            
            <div className="space-y-4">
              {reservation.hotel && (
                <div className="flex items-start space-x-3">
                  <FiHome className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Hotel</p>
                    <p className="font-semibold text-gray-900">{reservation.hotel.name}</p>
                    <p className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                      <FiMapPin size={14} />
                      <span>{reservation.hotel.city}</span>
                    </p>
                  </div>
                </div>
              )}

              {reservation.room_type && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-start space-x-3">
                    <FiPackage className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Meeting Package</p>
                      <p className="font-semibold text-gray-900">{reservation.room_type.type_name}</p>
                      <p className="text-sm text-gray-600 mt-1">{reservation.room_type.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Event Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <FiCalendar className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-semibold text-gray-900">{formatDate(reservation.check_in)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FiCalendar className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-semibold text-gray-900">{formatDate(reservation.check_out)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FiUsers className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Number of Guests</p>
                  <p className="font-semibold text-gray-900">{reservation.guest_count} guests</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FiPackage className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Event Type</p>
                  <p className="font-semibold text-gray-900">{reservation.event_type}</p>
                </div>
              </div>
            </div>

            {reservation.event_description && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Event Description</p>
                <p className="text-gray-900">{reservation.event_description}</p>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FiUser className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-semibold text-gray-900">{reservation.customer_name}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FiMail className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{reservation.customer_email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FiPhone className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-semibold text-gray-900">{reservation.customer_phone}</p>
                </div>
              </div>

              {reservation.customer_ref && (
                <div className="flex items-start space-x-3">
                  <FiHome className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Company/Organization</p>
                    <p className="font-semibold text-gray-900">{reservation.customer_ref}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price per person:</span>
                <span className="font-medium">Rp {(reservation.price_per_person || 0).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Number of guests:</span>
                <span className="font-medium">{reservation.guest_count || 0}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    Rp {(reservation.total_price || 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Info */}
          <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl shadow-md p-6 text-white mb-6">
            <div className="flex items-start space-x-3 mb-4">
              <FiShield className="flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-lg mb-2">Blockchain Security</h3>
                <p className="text-white/90 text-sm mb-3">
                  Your reservation is secured on Hyperledger Fabric blockchain with immutable proof.
                </p>
                <div className="bg-white/20 rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Reservation ID:</span>
                    <span className="font-mono font-semibold">{reservation.reservation_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{formatDateTime(reservation.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/hotels" className="btn-primary flex-1 text-center">
              Book Another Hotel
            </Link>
            <button
              onClick={() => window.print()}
              className="btn-secondary flex-1"
            >
              Print Confirmation
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
