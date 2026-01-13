'use client'

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiHome,
  FiLock,
  FiMail,
  FiMapPin,
  FiUser,
} from 'react-icons/fi';

import {
  Footer,
  Navbar,
} from '@/components/landing';
import { API_ENDPOINTS } from '@/lib/api';

export default function RegisterHotelPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    // User details
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    
    // Hotel details
    hotel_name: '',
    hotel_city: '',
    hotel_address: '',
    hotel_description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!formData.hotel_name || !formData.hotel_city || !formData.hotel_address) {
      setError('Please fill in all required hotel details')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER_HOTEL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Save token and user data to localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('hotel', JSON.stringify(data.hotel))
        
        // Redirect to hotel admin dashboard
        setTimeout(() => {
          router.push('/hotel-admin')
        }, 2000)
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-600 text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Hotel Registered Successfully!
              </h2>
              <p className="text-gray-600">
                Your hotel has been created and you are now the Super Admin.
              </p>
            </div>
            <div className="space-y-2 text-left bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                ✅ Hotel account created
              </p>
              <p className="text-sm text-gray-700">
                ✅ Super Admin privileges granted
              </p>
              <p className="text-sm text-gray-700">
                ✅ You can now manage rooms, packages, and bookings
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Redirecting to your hotel dashboard...
            </p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="mb-8 text-center">
            <Link
              href="/register"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
            >
              <FiArrowLeft className="mr-2" />
              Back to Registration Options
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Register Your Hotel
            </h1>
            <p className="text-lg text-gray-600">
              Become a partner and start managing your hotel bookings
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <FiAlertCircle className="text-red-600 mr-3 mt-0.5" size={20} />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="mr-2 text-primary-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="08123456789"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="hotel@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hotel Information */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiHome className="mr-2 text-primary-600" />
                  Hotel Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="hotel_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Hotel Name *
                    </label>
                    <input
                      type="text"
                      id="hotel_name"
                      name="hotel_name"
                      value={formData.hotel_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Grand Luxury Hotel & Resort"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="hotel_city" className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          id="hotel_city"
                          name="hotel_city"
                          value={formData.hotel_city}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Bandung"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="hotel_address" className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="hotel_address"
                        name="hotel_address"
                        value={formData.hotel_address}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Jl. Raya No. 123"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="hotel_description" className="block text-sm font-medium text-gray-700 mb-2">
                      Hotel Description (Optional)
                    </label>
                    <textarea
                      id="hotel_description"
                      name="hotel_description"
                      value={formData.hotel_description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Describe your hotel, amenities, and services..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> By registering, you will become the Super Admin of your hotel with full management privileges including:
                </p>
                <ul className="mt-2 text-sm text-blue-700 space-y-1 ml-4 list-disc">
                  <li>Manage room types and availability</li>
                  <li>Create and update meeting packages</li>
                  <li>View and manage bookings</li>
                  <li>Add additional admin users</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering Hotel...' : 'Register Hotel'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
