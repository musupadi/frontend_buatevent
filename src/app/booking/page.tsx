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
  FiCheck,
  FiCheckCircle,
  FiMapPin,
  FiUsers,
} from 'react-icons/fi';

import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';

interface Hotel {
  id: number
  name: string
  city: string
  address: string
  rating: number
}

interface RoomType {
  id: number
  hotel_id: number
  type_name: string
  description: string
  price_per_person: number
  min_capacity: number
  max_capacity: number
}

interface PriceCalculation {
  price_per_person: number
  guest_count: number
  base_price: number
  duration_days: number
  total_price: number
  currency: string
}

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hotelId = searchParams.get('hotel_id')
  const roomTypeId = searchParams.get('room_type_id')

  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [roomType, setRoomType] = useState<RoomType | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Form state
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [eventType, setEventType] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerRef, setCustomerRef] = useState('')

  // Price calculation
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null)
  const [calculatingPrice, setCalculatingPrice] = useState(false)

  // Check if user is logged in and redirect if not
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      // Redirect to login with message and return URL
      const currentUrl = `/booking?hotel_id=${hotelId}&room_type_id=${roomTypeId}`
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}&message=${encodeURIComponent('You need to login to make a booking')}`)
      return
    }
    
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    
    // Auto-fill user data
    setCustomerName(parsedUser.full_name || '')
    setCustomerEmail(parsedUser.email || '')
    setCustomerPhone(parsedUser.phone || '')
    setCustomerRef(parsedUser.company || '')
  }, [hotelId, roomTypeId, router])

  // Load hotel and room type data
  useEffect(() => {
    if (!hotelId || !roomTypeId) {
      setError('Invalid booking parameters')
      setLoading(false)
      return
    }

    // Only load if user is set
    if (!user) return

    Promise.all([
      fetch(`http://localhost:8080/api/v1/hotels/${hotelId}`).then((res) => res.json()),
      fetch(`http://localhost:8080/api/v1/hotels/${hotelId}/room-types`).then((res) => res.json()),
    ])
      .then(([hotelData, roomTypesData]) => {
        setHotel(hotelData.hotel || hotelData)
        const roomTypes = roomTypesData.room_types || []
        const selectedRoom = roomTypes.find((rt: RoomType) => rt.id === parseInt(roomTypeId))
        setRoomType(selectedRoom)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error:', err)
        setError('Failed to load booking details')
        setLoading(false)
      })
  }, [hotelId, roomTypeId, user])

  // Calculate price when relevant fields change
  useEffect(() => {
    if (roomType && guestCount && checkIn && checkOut) {
      calculatePrice()
    }
  }, [roomType, guestCount, checkIn, checkOut])

  const calculatePrice = async () => {
    if (!roomType || !guestCount || !checkIn || !checkOut) return

    const guests = parseInt(guestCount)
    if (guests < roomType.min_capacity || guests > roomType.max_capacity) {
      setPriceCalculation(null)
      return
    }

    setCalculatingPrice(true)
    try {
      const response = await fetch('http://localhost:8080/api/v1/calculate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_type_id: roomType.id,
          guest_count: guests,
          check_in: checkIn,
          check_out: checkOut,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPriceCalculation(data.calculation)
      }
    } catch (err) {
      console.error('Price calculation error:', err)
    } finally {
      setCalculatingPrice(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      // Generate reservation ID
      const timestamp = Date.now()
      const reservationId = `RES-${timestamp}`

      // Get token from localStorage
      const token = localStorage.getItem('token')
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('http://localhost:8080/api/v1/reservations', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          reservation_id: reservationId,
          hotel_id: hotelId,
          room_type_id: roomTypeId,
          check_in: checkIn,
          check_out: checkOut,
          guest_count: parseInt(guestCount),
          event_type: eventType,
          event_description: eventDescription,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_ref: customerRef,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/reservations/${data.reservation.reservation_id}`)
        }, 2000)
      } else {
        setError(data.error || 'Failed to create reservation')
      }
    } catch (err) {
      console.error('Booking error:', err)
      setError('Failed to submit booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </>
    )
  }

  if (error && !hotel) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <FiAlertCircle className="mx-auto text-red-600 mb-4" size={48} />
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <button onClick={() => router.back()} className="btn-primary">
              Go Back
            </button>
          </div>
        </div>
      </>
    )
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center max-w-md">
            <FiCheckCircle className="mx-auto text-green-600 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your reservation has been recorded on the blockchain.
            </p>
            <div className="animate-pulse text-primary-600">Redirecting...</div>
          </div>
        </div>
      </>
    )
  }

  const minDate = new Date().toISOString().split('T')[0]

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="text-primary-600 hover:text-primary-700 mb-4 flex items-center space-x-2"
            >
              <span>← Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
            <p className="text-gray-600">Secured by Hyperledger Fabric Blockchain</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
                {/* Event Details */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiCalendar className="inline mr-2" />
                          Check-in Date *
                        </label>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          min={minDate}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiCalendar className="inline mr-2" />
                          Check-out Date *
                        </label>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          min={checkIn || minDate}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiUsers className="inline mr-2" />
                        Number of Guests *
                      </label>
                      <input
                        type="number"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        min={roomType?.min_capacity}
                        max={roomType?.max_capacity}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {roomType && (
                        <p className="text-sm text-gray-500 mt-1">
                          Min: {roomType.min_capacity}, Max: {roomType.max_capacity} guests
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Type *
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select event type</option>
                        <option value="Corporate Meeting">Corporate Meeting</option>
                        <option value="Team Building">Team Building</option>
                        <option value="Training Session">Training Session</option>
                        <option value="Conference">Conference</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Description
                      </label>
                      <textarea
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Describe your event..."
                      />
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                  {user && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-start space-x-2">
                      <FiCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <p className="text-sm text-green-800">
                        Your information has been auto-filled from your profile. You can edit if needed.
                      </p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company/Organization (Optional)
                      </label>
                      <input
                        type="text"
                        value={customerRef}
                        onChange={(e) => setCustomerRef(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !priceCalculation}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FiCheck />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>

                {hotel && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-1">{hotel.name}</h3>
                    <p className="text-sm text-gray-600 flex items-start space-x-2">
                      <FiMapPin className="flex-shrink-0 mt-0.5" />
                      <span>{hotel.city}</span>
                    </p>
                  </div>
                )}

                {roomType && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-1">{roomType.type_name}</h4>
                    <p className="text-sm text-gray-600">{roomType.description}</p>
                  </div>
                )}

                {priceCalculation ? (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price per person:</span>
                      <span className="font-medium">
                        Rp {(priceCalculation.price_per_person || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Number of guests:</span>
                      <span className="font-medium">{priceCalculation.guest_count || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{priceCalculation.duration_days || 0} day(s)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base price:</span>
                      <span className="font-medium">
                        Rp {(priceCalculation.base_price || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-primary-600">
                          Rp {(priceCalculation.total_price || 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {calculatingPrice ? (
                      <div className="flex flex-col items-center space-y-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        <p className="text-sm text-gray-600">Calculating price...</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">Fill in the form to see price details</p>
                    )}
                  </div>
                )}

                {/* Blockchain Badge */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <FiCheckCircle className="text-primary-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          Blockchain Secured
                        </h4>
                        <p className="text-xs text-gray-600">
                          Your reservation will be recorded on Hyperledger Fabric with immutable proof.
                        </p>
                      </div>
                    </div>
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
