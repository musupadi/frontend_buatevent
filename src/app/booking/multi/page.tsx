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
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiShoppingCart,
  FiTrash2,
  FiUsers,
  FiX,
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

interface RoomWithStatus {
  id: number
  room_number: string
  floor: number
  room_type_id: number
  type_name: string
  max_capacity: number
  price_per_person: number  // For hotel rooms
  room_category: string     // 'hotel_room' or 'meeting_room'
  pricing_type: string      // 'per_night', 'per_hour', 'half_day', 'full_day'
  hourly_rate?: number
  half_day_rate?: number
  full_day_rate?: number
  is_available: boolean
  is_booked: boolean
  layout_x?: number
  layout_y?: number
  layout_width?: number
  layout_height?: number
}

interface SelectedRoom {
  roomId: number
  roomNumber: string
  floor: number
  typeName: string
  capacity: number
  pricePerRoom: number
  guestsPerRoom: number
}

export default function MultiBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelId = searchParams.get('hotel_id');

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<RoomWithStatus[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<SelectedRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  // Booking details
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [bookingDate, setBookingDate] = useState(''); // For meeting rooms (single date)
  const [startTime, setStartTime] = useState(''); // For meeting rooms
  const [endTime, setEndTime] = useState(''); // For meeting rooms
  const [selectedPackage, setSelectedPackage] = useState<'hourly' | 'half_day' | 'full_day'>('hourly'); // For meeting rooms
  const [bookingMode, setBookingMode] = useState<'hotel_room' | 'meeting_room'>('hotel_room'); // NEW: Booking mode selector
  const [eventType, setEventType] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerRef, setCustomerRef] = useState('');
  
  // Filters
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');

  useEffect(() => {
    if (!hotelId) {
      router.push('/hotels');
      return;
    }

    fetch(API_ENDPOINTS.HOTEL_BY_ID(hotelId))
      .then(res => res.json())
      .then(hotelData => {
        setHotel(hotelData.hotel || hotelData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });

    // Auto-fill user profile data
    const token = localStorage.getItem('token');
    if (token) {
      setLoadingProfile(true);
      fetch('http://localhost:8080/api/v1/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(async res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          console.log('Profile data received:', data);
          if (data.user) {
            setCustomerName(data.user.full_name || data.user.name || '');
            setCustomerEmail(data.user.email || '');
            setCustomerPhone(data.user.phone_number || data.user.phone || '');
          }
          setLoadingProfile(false);
        })
        .catch(err => {
          console.error('Error loading profile:', err);
          setLoadingProfile(false);
        });
    } else {
      console.warn('No token found - user may not be logged in');
    }
  }, [hotelId, router]);

  // Load rooms with status when dates are selected
  useEffect(() => {
    if (!hotelId || !checkIn || !checkOut) return;

    setLoadingRooms(true);
    const url = `http://localhost:8080/api/v1/hotels/${hotelId}/rooms-with-status?check_in=${checkIn}&check_out=${checkOut}`;
    console.log('Fetching rooms from:', url);
    
    fetch(url)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Rooms with status:', data);
        const loadedRooms = data.rooms || [];
        setRooms(loadedRooms);
        
        // Auto-select floor 1 if rooms exist and no floor is selected
        if (loadedRooms.length > 0 && selectedFloor === null) {
          const floorSet = new Set<number>();
          loadedRooms.forEach((r: any) => floorSet.add(r.floor));
          const floors = Array.from(floorSet).sort((a, b) => a - b);
          if (floors.length > 0) {
            setSelectedFloor(floors[0]);
          }
        }
        
        setLoadingRooms(false);
      })
      .catch(err => {
        console.error('Error loading rooms:', err);
        alert(`Failed to load rooms: ${err.message}\n\nMake sure backend is running on port 8080`);
        setLoadingRooms(false);
      });
  }, [hotelId, checkIn, checkOut]);

  const toggleRoomSelection = (room: RoomWithStatus) => {
    if (room.is_booked || !room.is_available) return;

    const isSelected = selectedRooms.some(r => r.roomId === room.id);
    
    if (isSelected) {
      setSelectedRooms(selectedRooms.filter(r => r.roomId !== room.id));
    } else {
      // Allow mixed booking - just add to selection
      setSelectedRooms([...selectedRooms, {
        roomId: room.id,
        roomNumber: room.room_number,
        floor: room.floor,
        typeName: room.type_name,
        capacity: room.max_capacity,
        pricePerRoom: getRoomPrice(room),
        guestsPerRoom: 1
      }]);
    }
  };

  const updateGuestsForRoom = (roomId: number, guests: number) => {
    setSelectedRooms(selectedRooms.map(room =>
      room.roomId === roomId ? { ...room, guestsPerRoom: guests } : room
    ));
  };

  const removeSelectedRoom = (roomId: number) => {
    setSelectedRooms(selectedRooms.filter(r => r.roomId !== roomId));
  };

  const getTotalPrice = () => {
    return selectedRooms.reduce((sum, room) => {
      const roomData = rooms.find(r => r.id === room.roomId);
      if (roomData?.room_category === 'meeting_room') {
        // Use package-specific price for meeting rooms
        if (selectedPackage === 'hourly' && roomData.hourly_rate) return sum + roomData.hourly_rate;
        if (selectedPackage === 'half_day' && roomData.half_day_rate) return sum + roomData.half_day_rate;
        if (selectedPackage === 'full_day' && roomData.full_day_rate) return sum + roomData.full_day_rate;
      }
      return sum + room.pricePerRoom;
    }, 0);
  };

  const getTotalGuests = () => {
    return selectedRooms.reduce((sum, room) => sum + room.guestsPerRoom, 0);
  };

  const getUniqueFloors = () => {
    return Array.from(new Set(rooms.map(r => r.floor))).sort((a, b) => a - b);
  };

  const getUniqueTypes = () => {
    return Array.from(new Set(rooms.map(r => r.type_name)));
  };

  // Get display price for room based on category and package
  const getRoomPrice = (room: RoomWithStatus, packageType?: 'hourly' | 'half_day' | 'full_day'): number => {
    if (room.room_category === 'meeting_room') {
      // For meeting rooms, return price based on package
      if (packageType === 'hourly' && room.hourly_rate) return room.hourly_rate;
      if (packageType === 'half_day' && room.half_day_rate) return room.half_day_rate;
      if (packageType === 'full_day' && room.full_day_rate) return room.full_day_rate;
      // Default to hourly rate
      return room.hourly_rate || room.half_day_rate || room.full_day_rate || 0;
    } else {
      // For hotel rooms, use price per person
      return room.price_per_person || 0;
    }
  };

  // Get price label
  const getPriceLabel = (room: RoomWithStatus): string => {
    if (room.room_category === 'meeting_room') {
      if (room.pricing_type === 'per_hour') return '/hour';
      if (room.pricing_type === 'half_day') return '/half-day';
      if (room.pricing_type === 'full_day') return '/full-day';
      return '/session';
    }
    return '/room';
  };

  // Check if selected rooms are meeting rooms
  const hasSelectedMeetingRooms = (): boolean => {
    if (selectedRooms.length === 0) return false;
    const firstSelectedRoom = rooms.find(r => r.id === selectedRooms[0].roomId);
    return firstSelectedRoom?.room_category === 'meeting_room';
  };

  // Check if selected rooms are hotel rooms
  const hasSelectedHotelRooms = (): boolean => {
    if (selectedRooms.length === 0) return false;
    const firstSelectedRoom = rooms.find(r => r.id === selectedRooms[0].roomId);
    return firstSelectedRoom?.room_category === 'hotel_room' || !firstSelectedRoom?.room_category;
  };

  // Get room type colors for visual differentiation (avoid blue - reserved for selected state)
  const getRoomTypeColor = (roomTypeId: number) => {
    const colors = [
      { bg: 'bg-green-500', hover: 'hover:bg-green-600', text: 'Green' },
      { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', text: 'Amber' },
      { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', text: 'Purple' },
      { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', text: 'Orange' },
      { bg: 'bg-pink-500', hover: 'hover:bg-pink-600', text: 'Pink' },
      { bg: 'bg-teal-500', hover: 'hover:bg-teal-600', text: 'Teal' },
    ];
    
    const uniqueTypeIds = Array.from(new Set(rooms.map(r => r.room_type_id))).sort((a, b) => a - b);
    const index = uniqueTypeIds.indexOf(roomTypeId);
    return colors[index % colors.length];
  };

  const getRoomTypeLegend = () => {
    const uniqueTypes = new Map<number, { id: number; name: string }>();
    rooms.forEach(room => {
      if (!uniqueTypes.has(room.room_type_id)) {
        uniqueTypes.set(room.room_type_id, {
          id: room.room_type_id,
          name: room.type_name
        });
      }
    });
    return Array.from(uniqueTypes.values());
  };

  const filteredRooms = rooms.filter(room => {
    // Show ALL rooms regardless of category - let user choose by clicking
    if (selectedFloor !== null && room.floor !== selectedFloor) return false;
    if (selectedType && room.type_name !== selectedType) return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRooms.length === 0) {
      alert('Pilih room terlebih dahulu!');
      return;
    }

    // Check if there are meeting rooms in selection
    const hasMeetingRooms = selectedRooms.some(sr => {
      const room = rooms.find(r => r.id === sr.roomId);
      return room?.room_category === 'meeting_room';
    });

    // Check if there are hotel rooms in selection
    const hasHotelRooms = selectedRooms.some(sr => {
      const room = rooms.find(r => r.id === sr.roomId);
      return room?.room_category !== 'meeting_room';
    });

    // Get room_type_id from first selected room
    const firstRoom = rooms.find(r => r.id === selectedRooms[0].roomId);
    if (!firstRoom) {
      alert('Error: Room data not found');
      return;
    }

    const isMeetingRoom = firstRoom.room_category === 'meeting_room';

    // Validate based on room types in selection
    if (hasMeetingRooms && !hasHotelRooms) {
      // Only meeting rooms - validate time
      if (!bookingDate || !startTime || !endTime) {
        alert('Mohon lengkapi tanggal dan waktu booking untuk meeting room!');
        return;
      }
      if (!selectedPackage) {
        alert('Mohon pilih paket booking!');
        return;
      }
      
      // Validate time range
      const start = new Date(`${bookingDate}T${startTime}`);
      const end = new Date(`${bookingDate}T${endTime}`);
      if (end <= start) {
        alert('Jam selesai harus setelah jam mulai!');
        return;
      }
    } else if (hasHotelRooms && !hasMeetingRooms) {
      // Only hotel rooms - validate dates
      if (!checkIn || !checkOut) {
        alert('Mohon pilih tanggal check-in dan check-out untuk hotel room!');
        return;
      }
    } else if (hasMeetingRooms && hasHotelRooms) {
      // Mixed booking allowed - validate all
      if (!checkIn || !checkOut) {
        alert('Mohon pilih tanggal check-in dan check-out untuk hotel room!');
        return;
      }
      if (!bookingDate || !startTime || !endTime) {
        alert('Mohon lengkapi tanggal dan waktu booking untuk meeting room!');
        return;
      }
      if (!selectedPackage) {
        alert('Mohon pilih paket booking untuk meeting room!');
        return;
      }
    }

    const bookingData: any = {
      reservation_id: `RES-${Date.now()}`,
      hotel_id: hotelId!,
      room_type_id: firstRoom.room_type_id.toString(),
      guest_count: getTotalGuests(),
      event_type: eventType,
      event_description: eventDescription,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      customer_ref: customerRef,
      selected_room_ids: selectedRooms.map(room => room.roomId)
    };

    // Add booking dates - for mixed booking or hotel only
    if (hasHotelRooms) {
      // Hotel rooms need check-in/check-out
      bookingData.check_in = checkIn;
      bookingData.check_out = checkOut;
    }

    // Add meeting room specific data if there are meeting rooms
    if (hasMeetingRooms) {
      // For pure meeting room booking without hotel, use bookingDate as check-in/out
      if (!hasHotelRooms) {
        bookingData.check_in = bookingDate;
        bookingData.check_out = bookingDate;
      }
      bookingData.start_time = startTime;
      bookingData.end_time = endTime;
      
      // Calculate duration in hours
      const start = new Date(`${bookingDate}T${startTime}`);
      const end = new Date(`${bookingDate}T${endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      bookingData.booking_duration_hours = hours;
      bookingData.pricing_type = selectedPackage;
    }

    console.log('Booking data:', bookingData);

    try {
      const response = await fetch(API_ENDPOINTS.RESERVATIONS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Booking berhasil!');
        router.push(`/reservations/${data.reservation_id || data.reservationID}`);
      } else {
        throw new Error(data.error || 'Booking gagal');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(`❌ Gagal membuat booking: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (!hotel) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg">Hotel tidak ditemukan</p>
            <button
              onClick={() => router.push('/hotels')}
              className="mt-4 btn-primary"
            >
              Kembali ke Hotels
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <FiArrowLeft />
              <span>Kembali</span>
            </button>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🎬 Cinema-Style Room Booking
            </h1>
            <p className="text-xl text-gray-600">
              {hotel.name} • {hotel.city}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Pilih room yang tersedia seperti memilih kursi bioskop! Room yang sudah dibooking tetap terlihat tapi tidak bisa dipilih.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Room Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Date Selection */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  📅 Pilih Tanggal
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Pilih tanggal check-in/check-out untuk hotel room, atau pilih room di peta untuk mengatur detail booking
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Room Map */}
              {(checkIn && checkOut) && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      🗺️ Peta Room
                    </h2>
                    
                    {/* Legend */}
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded opacity-50"></div>
                        <span>Booked</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-purple-400 rounded ring-2 ring-purple-400"></div>
                        <span>💼 Meeting Room</span>
                      </div>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div>
                      <label className="text-sm text-gray-600 mr-2">Floor:</label>
                      <select
                        value={selectedFloor ?? ''}
                        onChange={(e) => setSelectedFloor(e.target.value ? parseInt(e.target.value) : null)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        {getUniqueFloors().map(floor => (
                          <option key={floor} value={floor}>Floor {floor}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mr-2">Type:</label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="">All Types</option>
                        {getUniqueTypes().map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {loadingRooms ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <p className="mt-2 text-gray-600">Loading rooms...</p>
                    </div>
                  ) : filteredRooms.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      No rooms available for selected filters
                    </div>
                  ) : (
                    <>
                      {/* Visual Floor Plan */}
                      <div className="relative bg-gray-100 rounded-lg p-6" style={{ minHeight: '500px', height: '600px' }}>
                        {filteredRooms.map(room => {
                          const isSelected = selectedRooms.some(r => r.roomId === room.id);
                          const canSelect = room.is_available && !room.is_booked;
                          const roomColor = getRoomTypeColor(room.room_type_id);
                          const isMeetingRoom = room.room_category === 'meeting_room';
                          
                          // Skip rooms without layout coordinates
                          if (room.layout_x === null || room.layout_x === undefined) return null;
                          
                          return (
                            <button
                              key={room.id}
                              onClick={() => toggleRoomSelection(room)}
                              disabled={!canSelect}
                              className={`
                                absolute rounded-lg font-semibold text-sm transition-all shadow-md
                                ${isSelected
                                  ? 'bg-blue-500 text-white ring-2 ring-blue-600 shadow-lg z-10'
                                  : room.is_booked
                                    ? 'bg-red-600 text-white opacity-70 cursor-not-allowed'
                                    : !room.is_available
                                      ? 'bg-gray-400 text-white opacity-50 cursor-not-allowed'
                                      : `${roomColor.bg} text-white ${roomColor.hover} hover:scale-105 hover:z-10 ${
                                          isMeetingRoom ? 'ring-2 ring-purple-400 ring-offset-1' : ''
                                        }`
                                }
                              `}
                              style={{
                                left: `${room.layout_x}px`,
                                top: `${room.layout_y}px`,
                                width: `${room.layout_width || 100}px`,
                                height: `${room.layout_height || 80}px`,
                              }}
                              title={`${room.room_number} - ${room.type_name}${isMeetingRoom ? ' (Meeting Room)' : ''}\nFloor ${room.floor}\nCapacity: ${room.max_capacity} guests\nRp ${getRoomPrice(room).toLocaleString('id-ID')}${getPriceLabel(room)}\n${room.is_booked ? 'BOOKED' : room.is_available ? 'Available' : 'Unavailable'}`}
                            >
                            <div className="flex flex-col items-center justify-center h-full">
                              <div className="text-xs font-bold">
                                {isMeetingRoom && '💼 '}
                                {room.room_number}
                              </div>
                              <div className="text-[10px] opacity-75">👥{room.max_capacity}</div>
                            </div>
                              {isSelected && (
                                <FiCheck className="absolute top-1 right-1" size={14} />
                              )}
                              {room.is_booked && (
                                <FiX className="absolute top-1 right-1" size={14} />
                              )}
                            </button>
                          );
                        })}
                        
                        {/* Show message if no layout configured */}
                        {filteredRooms.length > 0 && filteredRooms.every(r => !r.layout_x) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-6 bg-white rounded-lg shadow-md">
                              <p className="text-gray-600 mb-2">⚠️ Denah room belum dikonfigurasi</p>
                              <p className="text-sm text-gray-500">Hotel admin perlu mengatur layout di Room Layout page</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Room Type Legend */}
                      {rooms.length > 0 && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">🎨 Room Types:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {getRoomTypeLegend().map(type => {
                              const color = getRoomTypeColor(type.id);
                              return (
                                <div key={type.id} className="flex items-center space-x-2">
                                  <div className={`w-4 h-4 rounded ${color.bg}`}></div>
                                  <span className="text-sm text-gray-700">{type.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Booking Form */}
              {selectedRooms.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    📋 Detail Booking
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipe Event <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Pilih tipe event</option>
                        <option value="meeting">Meeting</option>
                        <option value="seminar">Seminar</option>
                        <option value="workshop">Workshop</option>
                        <option value="training">Training</option>
                        <option value="conference">Conference</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi Event
                      </label>
                      <textarea
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Detail acara Anda..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          No. Telepon <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company/Organization
                        </label>
                        <input
                          type="text"
                          value={customerRef}
                          onChange={(e) => setCustomerRef(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right: Selected Rooms Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FiShoppingCart className="text-primary-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">Selected</h2>
                </div>

                {selectedRooms.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Belum ada room dipilih</p>
                    <p className="text-sm text-gray-400 mt-2">Pilih tanggal dan klik room hijau</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                      {selectedRooms.map(room => {
                        const roomData = rooms.find(r => r.id === room.roomId);
                        const isMeetingRoom = roomData?.room_category === 'meeting_room';
                        
                        return (
                        <div key={room.roomId} className="border-2 border-blue-200 rounded-lg p-3 bg-blue-50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900">
                                {isMeetingRoom && '💼 '}
                                Room {room.roomNumber}
                              </h3>
                              <p className="text-xs text-gray-600">
                                Floor {room.floor} • {room.typeName}
                              </p>
                              <p className="text-xs text-blue-600 font-medium">
                                👥 Max {room.capacity} guests
                              </p>
                              {isMeetingRoom && (
                                <p className="text-xs text-green-600 font-semibold mt-1">
                                  {selectedPackage === 'hourly' && roomData?.hourly_rate && `Rp ${roomData.hourly_rate.toLocaleString('id-ID')}/jam`}
                                  {selectedPackage === 'half_day' && roomData?.half_day_rate && `Rp ${roomData.half_day_rate.toLocaleString('id-ID')}/half-day`}
                                  {selectedPackage === 'full_day' && roomData?.full_day_rate && `Rp ${roomData.full_day_rate.toLocaleString('id-ID')}/full-day`}
                                </p>
                              )}
                              {!isMeetingRoom && (
                                <p className="text-xs text-green-600 font-semibold mt-1">
                                  Rp {room.pricePerRoom.toLocaleString('id-ID')}/room
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeSelectedRoom(room.roomId)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>

                          {/* Meeting Room Time Controls */}
                          {isMeetingRoom && (
                            <div className="mb-2 pb-2 border-b border-blue-200">
                              <div className="mb-2">
                                <label className="text-xs text-gray-600 block mb-1">📅 Tanggal Meeting</label>
                                <input
                                  type="date"
                                  value={bookingDate}
                                  onChange={(e) => setBookingDate(e.target.value)}
                                  min={checkIn || new Date().toISOString().split('T')[0]}
                                  max={checkOut || undefined}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                  title={checkIn && checkOut ? `Pilih tanggal antara ${checkIn} dan ${checkOut}` : 'Pilih check-in/check-out terlebih dahulu'}
                                />
                              </div>
                              
                              {/* Package Selector */}
                              <div className="flex gap-1 mb-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedPackage('hourly');
                                    // Reset times for manual input
                                    setStartTime('');
                                    setEndTime('');
                                  }}
                                  className={`flex-1 px-2 py-1 rounded text-xs font-medium ${
                                    selectedPackage === 'hourly'
                                      ? 'bg-purple-500 text-white'
                                      : 'bg-gray-200 text-gray-700'
                                  }`}
                                >
                                  Hourly
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedPackage('half_day');
                                    // Auto set half day hours (08:00-13:00)
                                    setStartTime('08:00');
                                    setEndTime('13:00');
                                  }}
                                  className={`flex-1 px-2 py-1 rounded text-xs font-medium ${
                                    selectedPackage === 'half_day'
                                      ? 'bg-purple-500 text-white'
                                      : 'bg-gray-200 text-gray-700'
                                  }`}
                                >
                                  Half Day
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedPackage('full_day');
                                    // Auto set full day hours (08:00-17:00)
                                    setStartTime('08:00');
                                    setEndTime('17:00');
                                  }}
                                  className={`flex-1 px-2 py-1 rounded text-xs font-medium ${
                                    selectedPackage === 'full_day'
                                      ? 'bg-purple-500 text-white'
                                      : 'bg-gray-200 text-gray-700'
                                  }`}
                                >
                                  Full Day
                                </button>
                              </div>
                              
                              {/* Time Inputs - Only show for Hourly */}
                              {selectedPackage === 'hourly' ? (
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-xs text-gray-600 block mb-1">⏰ Jam Mulai</label>
                                    <input
                                      type="time"
                                      value={startTime}
                                      onChange={(e) => setStartTime(e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 block mb-1">⏰ Jam Selesai</label>
                                    <input
                                      type="time"
                                      value={endTime}
                                      onChange={(e) => setEndTime(e.target.value)}
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                  {selectedPackage === 'half_day' && '⏰ Jam: 08:00 - 13:00 (5 jam)'}
                                  {selectedPackage === 'full_day' && '⏰ Jam: 08:00 - 17:00 (9 jam)'}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Hotel Room Guest Controls */}
                          {!isMeetingRoom && (
                          <div>
                            <label className="text-xs text-gray-600 mb-1 block">
                              <FiUsers className="inline mr-1" />
                              Guests (max: {room.capacity})
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={room.capacity}
                              value={room.guestsPerRoom}
                              onChange={(e) => updateGuestsForRoom(room.roomId, Math.min(parseInt(e.target.value) || 0, room.capacity))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="0 = bebas"
                            />
                          </div>
                          )}

                          <div className="mt-2 pt-2 border-t border-blue-200">
                            <p className="text-xs text-gray-600">Subtotal:</p>
                            <p className="text-sm font-bold text-primary-600">
                              Rp {(isMeetingRoom 
                                ? (selectedPackage === 'hourly' && roomData?.hourly_rate) ||
                                  (selectedPackage === 'half_day' && roomData?.half_day_rate) ||
                                  (selectedPackage === 'full_day' && roomData?.full_day_rate) ||
                                  room.pricePerRoom
                                : room.pricePerRoom
                              ).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                        );
                      })}
                    </div>

                    <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Rooms:</span>
                        <span className="font-semibold">{selectedRooms.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Guests:</span>
                        <span className="font-semibold">{getTotalGuests()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-primary-600">
                          Rp {getTotalPrice().toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={selectedRooms.length === 0}
                      className="w-full mt-6 btn-primary flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <FiCalendar />
                      <span>Konfirmasi Booking</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
