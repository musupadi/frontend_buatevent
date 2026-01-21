'use client'

import {
  useEffect,
  useState,
} from 'react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiCreditCard,
  FiHome,
  FiInfo,
  FiMapPin,
  FiPackage,
  FiShield,
  FiUsers,
} from 'react-icons/fi';

import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';
import { API_ENDPOINTS } from '@/lib/api';

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
  price_per_person: number
  total_price: number
  currency: string
  status: string
  payment_status: string
  total_rooms?: number
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
  room_reservations?: Array<{
    room_id: number
    room_number: string
    floor: number
    status: string
    start_time?: string
    end_time?: string
    booking_duration_hours?: number
  }>
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reservationId = searchParams.get('id')

  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')

  useEffect(() => {
    if (!reservationId) {
      setError('Invalid reservation ID')
      setLoading(false)
      return
    }

    // Fetch reservation details
    fetch(API_ENDPOINTS.RESERVATION_BY_ID(reservationId))
      .then((res) => res.json())
      .then((data) => {
        if (data.reservation) {
          const res = data.reservation
          // Check if already paid
          if (res.payment_status === 'paid') {
            router.push(`/reservations/${reservationId}?message=already_paid`)
            return
          }
          // Check if cancelled
          if (res.status === 'CANCELLED') {
            setError('This reservation has been cancelled')
            setLoading(false)
            return
          }
          setReservation(res)
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
  }, [reservationId, router])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reservationId) return

    setProcessing(true)
    setError('')

    try {
      const response = await fetch(`http://localhost:8080/api/v1/reservations/${reservationId}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Payment successful, redirect to confirmation
        router.push(`/reservations/${reservationId}?payment=success`)
      } else {
        setError(data.error || 'Payment failed')
        setProcessing(false)
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError('Failed to process payment')
      setProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </>
    )
  }

  if (error && !reservation) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <FiAlertCircle className="mx-auto text-red-600 mb-4" size={48} />
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <button onClick={() => router.push('/my-bookings')} className="btn-primary">
              Back to My Bookings
            </button>
          </div>
        </div>
      </>
    )
  }

  if (!reservation) return null

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
            <p className="text-gray-600">Please select a payment method to confirm your booking</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              {/* Booking Summary */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FiHome className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Hotel</p>
                      <p className="font-semibold text-gray-900">{reservation.hotel.name}</p>
                      <p className="text-sm text-gray-600 flex items-center space-x-1 mt-1">
                        <FiMapPin size={14} />
                        <span>{reservation.hotel.city}</span>
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-start space-x-3">
                      <FiPackage className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Room Type</p>
                        <p className="font-semibold text-gray-900">{reservation.room_type.type_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <FiCalendar className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">Check-in</p>
                        <p className="font-medium text-sm">{formatDate(reservation.check_in)}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FiCalendar className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-xs text-gray-500">Check-out</p>
                        <p className="font-medium text-sm">{formatDate(reservation.check_out)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-start space-x-3">
                      <FiUsers className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Guests</p>
                        <p className="font-semibold text-gray-900">{reservation.guest_count} people</p>
                      </div>
                    </div>
                  </div>

                  {/* Rooms Booked */}
                  {reservation.room_reservations && reservation.room_reservations.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-start space-x-3">
                        <FiHome className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">Rooms Booked ({reservation.total_rooms || reservation.room_reservations.length})</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {reservation.room_reservations.map((room, idx) => (
                              <div key={idx} className="bg-primary-50 rounded-lg px-3 py-2">
                                <p className="text-xs text-gray-600">Floor {room.floor}</p>
                                <p className="font-semibold text-primary-700">{room.room_number}</p>
                                {/* Meeting room time info */}
                                {room.start_time && room.end_time && (
                                  <div className="mt-1 text-xs text-gray-600">
                                    <p>🕐 {room.start_time} - {room.end_time}</p>
                                    {room.booking_duration_hours && (
                                      <p className="font-medium text-primary-600">{room.booking_duration_hours}h</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Selection */}
              <form onSubmit={handlePayment}>
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FiCreditCard />
                    <span>Select Payment Method</span>
                  </h2>

                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Bank Transfer</p>
                        <p className="text-sm text-gray-600">Transfer to our bank account</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="e_wallet"
                        checked={paymentMethod === 'e_wallet'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">E-Wallet</p>
                        <p className="text-sm text-gray-600">GoPay, OVO, Dana, etc.</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="credit_card"
                        checked={paymentMethod === 'credit_card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Visa, Mastercard, etc.</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Cash on Arrival</p>
                        <p className="text-sm text-gray-600">Pay at hotel check-in</p>
                      </div>
                    </label>
                  </div>

                  {/* Payment Instructions */}
                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900 font-semibold mb-2">Bank Transfer Details:</p>
                      <p className="text-sm text-blue-800">Bank BCA: 1234567890</p>
                      <p className="text-sm text-blue-800">Account Name: PT BuatEvent Indonesia</p>
                      <p className="text-sm text-blue-800 mt-2">Please transfer the exact amount and upload proof of payment</p>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
                    <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <FiCheckCircle />
                      <span>Confirm Payment</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per person:</span>
                    <span className="font-medium">Rp {reservation.price_per_person.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Number of guests:</span>
                    <span className="font-medium">{reservation.guest_count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">Rp {(reservation.total_price - 10000).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
                    <span className="text-gray-600">Service Fee:</span>
                    <span className="font-medium text-green-600">Rp 10.000</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                      <span className="text-2xl font-bold text-primary-600">
                        Rp {reservation.total_price.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FiShield className="text-primary-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        Blockchain Secured
                      </h4>
                      <p className="text-xs text-gray-600">
                        Your payment will be recorded on Hyperledger Fabric blockchain
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <FiInfo className="flex-shrink-0 mt-0.5" size={16} />
                    <p>
                      After payment confirmation, your booking status will be automatically updated.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
