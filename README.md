# HotelChain - Blockchain Hotel Reservation Frontend

Modern, SEO-optimized landing page built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. Powered by Hyperledger Fabric blockchain.

## 🚀 Features

- ✅ **Server-Side Rendering (SSR)** for optimal SEO
- ✅ **Next.js 14** with App Router
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for modern UI
- ✅ **Framer Motion** for smooth animations
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **API Integration** with Go backend
- ✅ **Blockchain Transparency** showcase

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8080`

## 🛠️ Installation

```powershell
# Navigate to frontend-nextjs directory
cd frontend-nextjs

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will run on **http://localhost:3001**

## 📁 Project Structure

```
frontend-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with SEO metadata
│   │   ├── page.tsx             # Home page (Landing page)
│   │   └── globals.css          # Global styles
│   └── components/
│       └── landing/
│           ├── Navbar.tsx       # Responsive navigation
│           ├── Hero.tsx         # Hero section with CTA
│           ├── Features.tsx     # Platform features
│           ├── HotelShowcase.tsx # Featured hotels
│           ├── HowItWorks.tsx   # 3-step booking process
│           ├── Blockchain.tsx   # Blockchain benefits
│           ├── Testimonials.tsx # Customer reviews
│           ├── CTA.tsx          # Call-to-action
│           └── Footer.tsx       # Footer with links
├── public/                      # Static assets
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

## 🎨 Components Overview

### Navbar
- Sticky navigation with scroll effects
- Mobile hamburger menu
- Links to Features, Hotels, Blockchain sections

### Hero
- Full-screen hero with background image
- Dual CTA buttons (Explore Hotels, Learn More)
- Stats grid (21+ Hotels, 42+ Packages, etc.)
- Animated scroll indicator

### Features
- 6 key features with icons
- Blockchain Security, Transparent Pricing, Instant Confirmation
- 24/7 Availability, Verified Hotels, Multi-Location

### HotelShowcase
- Fetches real hotels from API
- Displays 6 featured hotels
- Image, rating, city, description
- Link to hotel details

### HowItWorks
- 3-step booking process
- Choose Hotel → Enter Details → Confirm & Pay
- Visual connection line (desktop)

### Blockchain
- Explains Hyperledger Fabric benefits
- Immutable records, transparency, smart contracts
- Network status visualization

### Testimonials
- 3 customer reviews
- Event organizers, corporate clients
- 5-star ratings with avatars

### CTA
- Final call-to-action
- Two buttons: Explore Hotels, Contact Sales
- Stats summary

### Footer
- Brand info with social links
- Quick links (Hotels, About, How It Works, FAQ)
- Support (Contact, Terms, Privacy, Refund)
- Contact information

## 🔧 Configuration

### next.config.js
```javascript
module.exports = {
  images: {
    domains: ['images.unsplash.com'], // External images
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*', // API proxy
      },
    ]
  },
}
```

### API Integration
- Backend proxy: `/api/*` → `http://localhost:8080/api/*`
- Hotels endpoint: `GET /api/v1/hotels`
- Calculate price: `POST /api/v1/calculate-price`

## 🎭 Animations

Using **Framer Motion** for smooth animations:
- Fade-in effects on scroll
- Slide-up/down transitions
- Scale on hover
- Stagger animations for lists

## 🌐 SEO Optimization

### Metadata (layout.tsx)
```typescript
export const metadata = {
  title: 'HotelChain - Blockchain Hotel Reservation',
  description: 'Book meeting venues with blockchain transparency...',
  keywords: 'hotel, blockchain, reservation, Hyperledger Fabric...',
  openGraph: { ... },  // Social sharing
  twitter: { ... },     // Twitter cards
}
```

### Benefits
- Server-Side Rendering (SSR)
- Static Site Generation (SSG) ready
- Semantic HTML structure
- Optimized images with Next.js Image
- Fast page load with code splitting

## 🎨 Styling

### Tailwind Custom Theme
```javascript
theme: {
  extend: {
    colors: {
      primary: {...},    // Blue shades
      secondary: {...},  // Purple shades
    },
    animation: {
      'fade-in': '...',
      'slide-up': '...',
    },
  },
}
```

### Custom CSS Classes (globals.css)
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container with shadow
- `.section-title` - Section heading style
- `.section-subtitle` - Section subheading

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All components are mobile-first and fully responsive.

## 🚀 Build & Deploy

```powershell
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🔗 Backend Integration

### Required Backend Endpoints

1. **GET /api/v1/hotels**
   - Returns list of all hotels
   - Used in HotelShowcase component

2. **GET /api/v1/hotels/:id**
   - Returns hotel details
   - For hotel detail page (to be created)

3. **POST /api/v1/calculate-price**
   - Body: `{ room_type_id, guest_count }`
   - Returns price breakdown
   - For booking form (to be created)

4. **POST /api/v1/reservations**
   - Create new reservation
   - For booking confirmation (to be created)

## 📝 Next Steps

### Pages to Create

1. **/hotels** - List all 21 hotels with filters
2. **/hotels/[id]** - Hotel details with packages
3. **/booking** - Booking form with auto-calculation
4. **/confirmation** - Blockchain confirmation page
5. **/about** - About us page
6. **/contact** - Contact form
7. **/faq** - Frequently asked questions

### Features to Add

- [ ] Search and filter hotels by city
- [ ] Date picker for check-in/out
- [ ] Price calculator preview
- [ ] Blockchain transaction viewer
- [ ] User authentication
- [ ] Booking history
- [ ] Payment integration
- [ ] Email notifications

## 🐛 Troubleshooting

### TypeScript Errors Before npm install
```
Cannot find module 'next' or 'react'...
```
**Solution**: Run `npm install` to install all dependencies.

### Port Already in Use (3001)
```powershell
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### API Connection Failed
- Ensure backend is running on `http://localhost:8080`
- Check `next.config.js` rewrites configuration
- Verify CORS settings in backend

## 📚 Tech Stack

- **Framework**: Next.js 14.0.4
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.4.0
- **Animation**: Framer Motion 10.16.16
- **HTTP Client**: Axios 1.6.2
- **Icons**: React Icons 4.12.0
- **Date Handling**: date-fns 3.0.6

## 📄 License

This project is part of the HotelChain blockchain reservation system.

## 👥 Support

For questions or issues:
- Email: info@hotelchain.com
- Phone: +62 812 3456 7890

---

**Built with ❤️ using Next.js and Hyperledger Fabric**
