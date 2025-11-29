# API Configuration Guide

## Environment Setup

API endpoint dikelola menggunakan environment variables untuk memudahkan deployment di berbagai environment (development, staging, production).

### File yang Dibuat

1. **`.env.local`** - File environment untuk development (tidak di-commit ke git)
2. **`.env.example`** - Template environment yang di-commit ke git
3. **`src/lib/api.ts`** - Centralized API configuration

### Cara Menggunakan

#### 1. Setup Environment Variable

Copy file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` dan sesuaikan API URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

#### 2. Import API_ENDPOINTS di Component/Page

```typescript
import { API_ENDPOINTS } from '@/lib/api';

// Gunakan endpoint yang sudah didefinisikan
fetch(API_ENDPOINTS.HOTELS)
fetch(API_ENDPOINTS.HOTEL_BY_ID('123'))
fetch(API_ENDPOINTS.LOGIN)
```

### Available Endpoints

- `API_ENDPOINTS.LOGIN` - Auth login
- `API_ENDPOINTS.REGISTER` - Auth register
- `API_ENDPOINTS.HOTELS` - List hotels
- `API_ENDPOINTS.HOTEL_BY_ID(id)` - Get hotel by ID
- `API_ENDPOINTS.HOTEL_ROOM_TYPES(id)` - Get hotel room types
- `API_ENDPOINTS.RESERVATIONS` - List/create reservations
- `API_ENDPOINTS.RESERVATION_BY_ID(id)` - Get reservation by ID
- `API_ENDPOINTS.MY_BOOKINGS` - Get user bookings
- `API_ENDPOINTS.CALCULATE_PRICE` - Calculate booking price
- `API_ENDPOINTS.BLOCKCHAIN_STATS` - Get blockchain stats
- `API_ENDPOINTS.BLOCKCHAIN_BLOCKS` - Get blockchain blocks

### Environment Variables untuk Different Environments

**Development:**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

**Staging:**
```env
NEXT_PUBLIC_API_BASE_URL=https://api-staging.yourdomain.com
```

**Production:**
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

### Next.js Rewrites

`next.config.js` sudah dikonfigurasi untuk menggunakan environment variable di rewrites:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
    },
  ];
}
```

### Notes

- Prefix `NEXT_PUBLIC_` diperlukan untuk expose environment variable ke browser
- Restart development server setelah mengubah `.env.local`
- File `.env.local` sudah ada di `.gitignore` untuk keamanan
