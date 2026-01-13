// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  
  // Auth
  LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
  REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
  REGISTER_HOTEL: `${API_BASE_URL}/api/v1/auth/register-hotel`,
  
  // Hotels
  HOTELS: `${API_BASE_URL}/api/v1/hotels`,
  HOTEL_BY_ID: (id: string) => `${API_BASE_URL}/api/v1/hotels/${id}`,
  HOTEL_ROOM_TYPES: (id: string) => `${API_BASE_URL}/api/v1/hotels/${id}/room-types`,
  AVAILABLE_ROOMS: (hotelId: string, roomTypeId: string, checkIn: string, checkOut: string) => 
    `${API_BASE_URL}/api/v1/hotels/${hotelId}/room-types/${roomTypeId}/available-rooms?check_in=${checkIn}&check_out=${checkOut}`,
  
  // Reservations
  RESERVATIONS: `${API_BASE_URL}/api/v1/reservations`,
  RESERVATION_BY_ID: (id: string) => `${API_BASE_URL}/api/v1/reservations/${id}`,
  MY_BOOKINGS: `${API_BASE_URL}/api/v1/reservations/user/my-bookings`,
  CALCULATE_PRICE: `${API_BASE_URL}/api/v1/calculate-price`,
  
  // Blockchain
  BLOCKCHAIN_STATS: `${API_BASE_URL}/api/v1/blockchain/stats`,
  BLOCKCHAIN_BLOCKS: `${API_BASE_URL}/api/v1/blockchain/blocks`,
};
