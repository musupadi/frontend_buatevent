'use client'

import {
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';
import {
  FiBarChart2,
  FiBook,
  FiDollarSign,
  FiEdit2,
  FiHome,
  FiLogOut,
  FiMenu,
  FiPackage,
  FiPlus,
  FiSettings,
  FiTrash2,
  FiUsers,
  FiX,
} from 'react-icons/fi';

export default function HotelAdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [hotel, setHotel] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalRooms: 0,
    bookedRooms: 0,
    totalRevenue: 0,
    pendingBookings: 0,
  })

  useEffect(() => {
    // Check authentication and role
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/login?message=Please login to access dashboard')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (!['hotel_super_admin', 'hotel_admin'].includes(parsedUser.role)) {
      router.push('/hotels?message=Access denied')
      return
    }

    setUser(parsedUser)
    
    // Fetch hotel data
    fetchHotelData(parsedUser.hotel_id)
    fetchStats(parsedUser.hotel_id)
  }, [router])

  const fetchHotelData = async (hotelId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/hotels/${hotelId}`)
      const data = await response.json()
      setHotel(data.hotel || data)
    } catch (error) {
      console.error('Failed to fetch hotel data:', error)
    }
  }

  const fetchStats = async (hotelId: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/v1/hotels/${hotelId}/statistics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      
      if (data.statistics) {
        setStats({
          totalRooms: data.statistics.totalRooms || 0,
          bookedRooms: data.statistics.bookedRooms || 0,
          totalRevenue: data.statistics.totalRevenue || 0,
          pendingBookings: data.statistics.pendingBookings || 0,
        })
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
      // Set default values on error
      setStats({
        totalRooms: 0,
        bookedRooms: 0,
        totalRevenue: 0,
        pendingBookings: 0,
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {sidebarOpen && <h2 className="text-xl font-bold">BuatEvent</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav className="mt-8">
          <MenuItem
            icon={<FiHome />}
            label="Overview"
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<FiBook />}
            label="Bookings"
            active={activeTab === 'bookings'}
            onClick={() => setActiveTab('bookings')}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<FiUsers />}
            label="Rooms"
            active={activeTab === 'rooms'}
            onClick={() => setActiveTab('rooms')}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<FiHome />}
            label="Room Types"
            active={activeTab === 'room-types'}
            onClick={() => setActiveTab('room-types')}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<FiUsers />}
            label="Team"
            active={activeTab === 'team'}
            onClick={() => setActiveTab('team')}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<FiBarChart2 />}
            label="Analytics"
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            collapsed={!sidebarOpen}
          />
          <MenuItem
            icon={<FiSettings />}
            label="Settings"
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            collapsed={!sidebarOpen}
          />
          
          {/* Logout Menu Item */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
              sidebarOpen ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' : 'text-red-400 hover:bg-red-500/10 justify-center'
            }`}
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {hotel ? hotel.name : 'Hotel Dashboard'}
                </h1>
                <p className="text-gray-600 mt-1">Welcome back, {user.full_name}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'hotel_super_admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user.role === 'hotel_super_admin' ? 'Super Admin' : 'Admin'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === 'overview' && <OverviewTab stats={stats} hotel={hotel} />}
          {activeTab === 'bookings' && user?.hotel_id && <BookingsTab hotelId={user.hotel_id} />}
          {activeTab === 'rooms' && user?.hotel_id && <RoomsTab hotelId={user.hotel_id} />}
          {activeTab === 'room-types' && user?.hotel_id && <RoomTypesTab hotelId={user.hotel_id} />}
          {activeTab === 'team' && user?.hotel_id && <TeamTab hotelId={user.hotel_id} isSuperAdmin={user.role === 'hotel_super_admin'} />}
          {activeTab === 'analytics' && user?.hotel_id && <AnalyticsTab hotelId={user.hotel_id} />}
          {activeTab === 'settings' && <SettingsTab hotel={hotel} user={user} />}
        </div>
      </main>
    </div>
  )
}

// Menu Item Component
function MenuItem({ icon, label, active, onClick, collapsed }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors ${
        active
          ? 'bg-primary-600 text-white'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <span className="text-xl">{icon}</span>
      {!collapsed && <span className="font-medium">{label}</span>}
    </button>
  )
}

// Overview Tab
function OverviewTab({ stats, hotel }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon={<FiHome className="text-blue-600" size={24} />}
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Booked Rooms"
          value={stats.bookedRooms}
          icon={<FiBook className="text-green-600" size={24} />}
          bgColor="bg-green-50"
        />
        <StatCard
          title="Total Revenue"
          value={`Rp ${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          icon={<FiDollarSign className="text-yellow-600" size={24} />}
          bgColor="bg-yellow-50"
        />
        <StatCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={<FiPackage className="text-purple-600" size={24} />}
          bgColor="bg-purple-50"
        />
      </div>

      {/* Hotel Info */}
      {hotel && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Hotel Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Hotel Name</p>
              <p className="font-semibold text-gray-900">{hotel.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">City</p>
              <p className="font-semibold text-gray-900">{hotel.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-semibold text-gray-900">{hotel.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rating</p>
              <p className="font-semibold text-gray-900">{hotel.rating} ⭐</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, icon, bgColor }: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// Bookings Tab
function BookingsTab({ hotelId }: any) {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBookings()
  }, [hotelId])

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/reservations/hotel/${hotelId}`)
      const data = await response.json()
      setBookings(data.reservations || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      setLoading(false)
    }
  }

  const handleCancelPending = async (reservationId: string) => {
    const reason = prompt('Please enter cancellation reason:')
    if (!reason) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/v1/reservations/${reservationId}/admin-cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      })

      const data = await response.json()
      
      if (response.ok) {
        alert('Reservation cancelled successfully')
        fetchBookings()
      } else {
        alert(data.error || 'Failed to cancel reservation')
      }
    } catch (error) {
      console.error('Cancel error:', error)
      alert('Failed to cancel reservation')
    }
  }

  const getPaymentBadge = (paymentStatus: string) => {
    const styles = {
      'paid': 'bg-green-100 text-green-800',
      'unpaid': 'bg-red-100 text-red-800',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[paymentStatus as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {paymentStatus === 'paid' ? '✓ Paid' : '✗ Unpaid'}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'CHECKED_IN': 'bg-green-100 text-green-800',
      'CHECKED_OUT': 'bg-gray-100 text-gray-800',
      'CANCELLED': 'bg-red-100 text-red-800',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    if (filter === 'pending') return booking.status === 'PENDING'
    if (filter === 'unpaid') return booking.payment_status === 'unpaid' && booking.status === 'PENDING'
    return true
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium ${filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('unpaid')}
            className={`px-4 py-2 rounded-lg font-medium ${filter === 'unpaid' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Unpaid
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-600">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-6 text-center text-gray-600">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservation ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking: any) => (
                  <tr key={booking.reservationID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {booking.reservationID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(booking.checkIn).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {booking.guestCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rp {parseFloat(booking.totalPrice).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentBadge(booking.payment_status || 'unpaid')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {booking.status === 'PENDING' && (booking.payment_status === 'unpaid' || !booking.payment_status) && (
                        <button
                          onClick={() => handleCancelPending(booking.reservationID)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        >
                          Cancel Unpaid
                        </button>
                      )}
                      {booking.status === 'PENDING' && booking.payment_status === 'paid' && (
                        <span className="text-xs text-gray-500">Paid - Can't cancel</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// Rooms Tab
function RoomsTab({ hotelId }: any) {
  const [rooms, setRooms] = useState<any[]>([])
  const [roomTypes, setRoomTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddRoom, setShowAddRoom] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any>(null)

  useEffect(() => {
    fetchRooms()
    fetchRoomTypes()
  }, [hotelId])

  const fetchRooms = async () => {
    console.log('Fetching rooms for hotel:', hotelId)
    try {
      const response = await fetch(`http://localhost:8080/api/v1/hotels/${hotelId}/rooms`)
      const data = await response.json()
      console.log('Rooms response:', data)
      setRooms(data.rooms || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
      setLoading(false)
    }
  }

  const fetchRoomTypes = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/hotels/${hotelId}/room-types`)
      const data = await response.json()
      setRoomTypes(data.room_types || [])
    } catch (error) {
      console.error('Failed to fetch room types:', error)
    }
  }

  const handleAddRoom = () => {
    setEditingRoom(null)
    setShowAddRoom(true)
  }

  const handleEditRoom = (room: any) => {
    setEditingRoom(room)
    setShowAddRoom(true)
  }

  const handleDeleteRoom = async (roomId: number) => {
    if (!confirm('Are you sure you want to delete this room?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/v1/hotels/${hotelId}/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        alert('Room deleted successfully')
        fetchRooms()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete room')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete room')
    }
  }

  const handleFormSuccess = () => {
    setShowAddRoom(false)
    setEditingRoom(null)
    fetchRooms()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Room Management</h2>
        <button
          onClick={handleAddRoom}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Room</span>
        </button>
      </div>
      
      {showAddRoom ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingRoom ? 'Edit Room' : 'Add New Room'}
          </h3>
          <RoomForm
            hotelId={hotelId}
            roomTypes={roomTypes}
            editingRoom={editingRoom}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowAddRoom(false)
              setEditingRoom(null)
            }}
          />
        </div>
      ) : null}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-600">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            No rooms found. Click "Add Room" to create your first room.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Floor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blockchain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {room.room_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Floor {room.floor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {roomTypes.find(rt => rt.id === room.room_type_id)?.type_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room.is_blockchain_enabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {room.is_blockchain_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room.status === 'AVAILABLE' 
                        ? 'bg-green-100 text-green-800' 
                        : room.status === 'OCCUPIED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditRoom(room)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// Room Form (Add/Edit)
function RoomForm({ hotelId, roomTypes, editingRoom, onSuccess, onCancel }: any) {
  const [formData, setFormData] = useState({
    room_type_id: editingRoom?.room_type_id || (roomTypes[0]?.id || ''),
    room_number: editingRoom?.room_number || '',
    floor: editingRoom?.floor || '',
    is_blockchain_enabled: editingRoom?.is_blockchain_enabled ?? true,
    status: editingRoom?.status || 'AVAILABLE',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const url = editingRoom
        ? `http://localhost:8080/api/v1/hotels/${hotelId}/rooms/${editingRoom.id}`
        : `http://localhost:8080/api/v1/hotels/${hotelId}/rooms`
      
      const response = await fetch(url, {
        method: editingRoom ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          room_type_id: parseInt(formData.room_type_id as string),
          room_number: formData.room_number,
          floor: parseInt(formData.floor as string),
          is_blockchain_enabled: formData.is_blockchain_enabled,
          status: formData.status,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message || 'Room saved successfully')
        onSuccess()
      } else {
        setError(data.error || 'Failed to save room')
      }
    } catch (err) {
      console.error('Save error:', err)
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Number *
          </label>
          <input
            type="text"
            value={formData.room_number}
            onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
            placeholder="e.g. 101, 102A"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Floor *
          </label>
          <input
            type="number"
            value={formData.floor}
            onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Type *
        </label>
        <select
          value={formData.room_type_id}
          onChange={(e) => setFormData({ ...formData, room_type_id: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        >
          {roomTypes.map((rt: any) => (
            <option key={rt.id} value={rt.id}>
              {rt.type_name}
            </option>
          ))}
        </select>
      </div>

      {editingRoom && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="OUT_OF_ORDER">Out of Order</option>
          </select>
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.is_blockchain_enabled}
          onChange={(e) => setFormData({ ...formData, is_blockchain_enabled: e.target.checked })}
          className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label className="ml-2 text-sm text-gray-700">
          Enable Blockchain (recommended for secure reservations)
        </label>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : editingRoom ? 'Update Room' : 'Add Room'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// Room Types Tab
function RoomTypesTab({ hotelId }: any) {
  const [roomTypes, setRoomTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingType, setEditingType] = useState<any>(null)

  useEffect(() => {
    fetchRoomTypes()
  }, [hotelId])

  const fetchRoomTypes = async () => {
    console.log('Fetching room types for hotel:', hotelId)
    try {
      const response = await fetch(`http://localhost:8080/api/v1/hotels/${hotelId}/room-types`)
      const data = await response.json()
      console.log('Room types response:', data)
      setRoomTypes(data.room_types || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch room types:', error)
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingType(null)
    setShowAddForm(true)
  }

  const handleEdit = (type: any) => {
    setEditingType(type)
    setShowAddForm(true)
  }

  const handleDelete = async (typeId: number) => {
    if (!confirm('Are you sure you want to delete this room type?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/v1/hotels/${hotelId}/room-types/${typeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        alert('Room type deleted successfully')
        fetchRoomTypes()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete room type')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete room type')
    }
  }

  const handleFormSuccess = () => {
    setShowAddForm(false)
    setEditingType(null)
    fetchRoomTypes()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Room Type Management</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Room Type</span>
        </button>
      </div>
      
      {showAddForm ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingType ? 'Edit Room Type' : 'Add New Room Type'}
          </h3>
          <RoomTypeForm
            hotelId={hotelId}
            editingType={editingType}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowAddForm(false)
              setEditingType(null)
            }}
          />
        </div>
      ) : null}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-600">Loading room types...</div>
        ) : roomTypes.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            No room types found. Click "Add Room Type" to create your first room type.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Rooms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blockchain
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roomTypes.map((type) => (
                <tr key={type.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{type.type_name}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    Rp {type.price_per_person?.toLocaleString('id-ID') || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {type.min_capacity} - {type.max_capacity} persons
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {type.total_rooms} rooms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      type.blockchain_reserved_rooms > 0
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {type.blockchain_reserved_rooms || 0} rooms
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(type)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// Room Type Form
function RoomTypeForm({ hotelId, editingType, onSuccess, onCancel }: any) {
  const [formData, setFormData] = useState({
    type_name: editingType?.type_name || '',
    description: editingType?.description || '',
    price_per_person: editingType?.price_per_person || '',
    min_capacity: editingType?.min_capacity || '',
    max_capacity: editingType?.max_capacity || '',
    amenities: editingType?.amenities || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const url = editingType
        ? `http://localhost:8080/api/v1/hotels/${hotelId}/room-types/${editingType.id}`
        : `http://localhost:8080/api/v1/hotels/${hotelId}/room-types`
      
      const response = await fetch(url, {
        method: editingType ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type_name: formData.type_name,
          description: formData.description,
          price_per_person: parseFloat(formData.price_per_person as string),
          min_capacity: parseInt(formData.min_capacity as string),
          max_capacity: parseInt(formData.max_capacity as string),
          amenities: formData.amenities,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message || 'Room type saved successfully')
        onSuccess()
      } else {
        setError(data.error || 'Failed to save room type')
      }
    } catch (err) {
      console.error('Save error:', err)
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type Name *
          </label>
          <input
            type="text"
            value={formData.type_name}
            onChange={(e) => setFormData({ ...formData, type_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
            placeholder="e.g. Deluxe Room, Standard Room"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price per Person *
          </label>
          <input
            type="number"
            value={formData.price_per_person}
            onChange={(e) => setFormData({ ...formData, price_per_person: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={3}
          placeholder="Describe this room type..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Capacity *
          </label>
          <input
            type="number"
            value={formData.min_capacity}
            onChange={(e) => setFormData({ ...formData, min_capacity: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Capacity *
          </label>
          <input
            type="number"
            value={formData.max_capacity}
            onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
            min="1"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Info:</strong> Total kamar dan jumlah blockchain akan otomatis dihitung dari tab <strong>Rooms</strong>. Anda hanya perlu mendefinisikan tipe kamar di sini, lalu tambahkan kamar individual (dengan nomor kamar) di tab Rooms.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amenities
        </label>
        <textarea
          value={formData.amenities}
          onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={4}
          placeholder="Daftar fasilitas yang tersedia di tipe kamar ini:&#10;- WiFi gratis&#10;- TV LED 42 inch&#10;- AC&#10;- Minibar&#10;- Kamar mandi dalam dengan shower&#10;- Air panas/dingin"
        />
        <p className="mt-1 text-xs text-gray-500">
          Pisahkan setiap fasilitas dengan enter atau gunakan tanda - untuk list
        </p>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : editingType ? 'Update Room Type' : 'Add Room Type'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// Analytics Tab
function AnalyticsTab({ hotelId }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Reports</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Analytics coming soon...</p>
      </div>
    </div>
  )
}

// Team Management Tab - Super Admin only
function TeamTab({ hotelId, isSuperAdmin }: { hotelId: number, isSuperAdmin: boolean }) {
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    password: '',
    role: 'staff',
    permissions: ''
  })

  useEffect(() => {
    fetchAdmins()
  }, [hotelId])

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/v1/hotels/${hotelId}/admins`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setAdmins(data.admins || [])
    } catch (error) {
      console.error('Failed to fetch admins:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSuperAdmin) {
      alert('Only Super Admin can manage team members')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const url = editingAdmin
        ? `http://localhost:8080/api/v1/hotels/${hotelId}/admins/${editingAdmin.id}`
        : `http://localhost:8080/api/v1/hotels/${hotelId}/admins`
      
      const method = editingAdmin ? 'PUT' : 'POST'
      const body = editingAdmin
        ? { role: formData.role, permissions: formData.permissions }
        : formData

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        alert(editingAdmin ? 'Admin updated successfully' : 'Admin added successfully')
        setShowForm(false)
        setEditingAdmin(null)
        setFormData({ email: '', full_name: '', phone: '', password: '', role: 'staff', permissions: '' })
        fetchAdmins()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save admin')
      }
    } catch (error) {
      console.error('Error saving admin:', error)
      alert('Failed to save admin')
    }
  }

  const handleDelete = async (adminId: number) => {
    if (!isSuperAdmin) {
      alert('Only Super Admin can remove team members')
      return
    }

    if (!confirm('Are you sure you want to remove this admin?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/v1/hotels/${hotelId}/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('Admin removed successfully')
        fetchAdmins()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to remove admin')
      }
    } catch (error) {
      console.error('Error removing admin:', error)
      alert('Failed to remove admin')
    }
  }

  const handleEdit = (admin: any) => {
    setEditingAdmin(admin)
    setFormData({
      email: admin.user.email,
      full_name: admin.user.full_name,
      phone: admin.user.phone,
      password: '',
      role: admin.role,
      permissions: admin.permissions || ''
    })
    setShowForm(true)
  }

  if (loading) return <div className="text-center py-8">Loading team members...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
        {isSuperAdmin && (
          <button
            onClick={() => {
              setEditingAdmin(null)
              setFormData({ email: '', full_name: '', phone: '', password: '', role: 'staff', permissions: '' })
              setShowForm(true)
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FiPlus />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            <strong>Note:</strong> Only Super Admin can add, edit, or remove team members.
          </p>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingAdmin ? 'Edit Team Member' : 'Add New Team Member'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingAdmin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                    minLength={6}
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permissions (JSON)</label>
              <textarea
                value={formData.permissions}
                onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder='{"manage_rooms": true, "manage_bookings": true}'
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                {editingAdmin ? 'Update' : 'Add'} Team Member
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingAdmin(null)
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Members List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              {isSuperAdmin && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{admin.user.full_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{admin.user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{admin.user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    admin.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                    admin.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    admin.user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {admin.user.status}
                  </span>
                </td>
                {isSuperAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="text-primary-600 hover:text-primary-800 mr-3"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {admins.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No team members found
          </div>
        )}
      </div>
    </div>
  )
}

// Settings Tab
function SettingsTab({ hotel, user }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: hotel?.name || '',
    city: hotel?.city || '',
    address: hotel?.address || '',
    description: hotel?.description || '',
    rating: hotel?.rating || 5,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8080/api/v1/hotels/${user.hotel_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Hotel information updated successfully!')
        setIsEditing(false)
        // Refresh page to show updated data
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setError(data.error || 'Failed to update hotel information')
      }
    } catch (err) {
      console.error('Update error:', err)
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Edit Hotel Info
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotel Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (1-5)
              </label>
              <input
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="1"
                max="5"
                step="0.1"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    name: hotel?.name || '',
                    city: hotel?.city || '',
                    address: hotel?.address || '',
                    description: hotel?.description || '',
                    rating: hotel?.rating || 5,
                  })
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Hotel Name</h3>
              <p className="text-lg text-gray-900">{hotel?.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">City</h3>
              <p className="text-lg text-gray-900">{hotel?.city}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
              <p className="text-lg text-gray-900">{hotel?.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <p className="text-gray-900">{hotel?.description || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Rating</h3>
              <p className="text-lg text-gray-900">{hotel?.rating || 5} / 5</p>
            </div>
            <div className="border-t pt-4 mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Account Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Email: </span>
                  <span className="text-sm text-gray-900">{user?.email}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Full Name: </span>
                  <span className="text-sm text-gray-900">{user?.full_name}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Role: </span>
                  <span className="text-sm text-gray-900">{user?.role === 'hotel_super_admin' ? 'Super Admin' : 'Admin'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
