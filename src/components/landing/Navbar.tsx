'use client'

import {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';
import {
  usePathname,
  useRouter,
} from 'next/navigation';
import {
  FiCalendar,
  FiLogOut,
  FiMenu,
  FiUser,
  FiX,
} from 'react-icons/fi';

function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Check if current page is landing page
  const isLandingPage = pathname === '/'
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setShowUserMenu(false)
    router.push('/')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      !isLandingPage 
        ? 'bg-white shadow-lg' 
        : isScrolled 
          ? 'bg-white shadow-lg' 
          : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">BE</span>
            </div>
            <span className={`text-2xl font-bold ${
              !isLandingPage || isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              BuatEvent
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="#features" 
              className={`font-medium transition-colors ${
                !isLandingPage || isScrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white hover:text-primary-200'
              }`}
            >
              Features
            </Link>
            <Link 
              href="#hotels" 
              className={`font-medium transition-colors ${
                !isLandingPage || isScrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white hover:text-primary-200'
              }`}
            >
              Hotels
            </Link>
            <Link 
              href="#blockchain" 
              className={`font-medium transition-colors ${
                !isLandingPage || isScrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white hover:text-primary-200'
              }`}
            >
              Blockchain
            </Link>
            
            {/* User Menu or Login Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    !isLandingPage || isScrolled 
                      ? 'bg-primary-50 text-primary-700 hover:bg-primary-100' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FiUser size={18} />
                  <span className="font-medium">{user.full_name}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/my-bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      href="/hotels"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Browse Hotels
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <FiLogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="btn-secondary"
              >
                Login
              </Link>
            )}
            
            <Link 
              href="/hotels" 
              className="btn-primary"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${
              !isLandingPage || isScrolled ? 'text-gray-900' : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 animate-slide-down bg-white rounded-b-lg shadow-lg">
            <div className="flex flex-col space-y-4 p-4">
              {/* User Info (Mobile) */}
              {user && (
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">{user.full_name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              )}

              <Link 
                href="#features"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#hotels"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Hotels
              </Link>
              <Link 
                href="#blockchain"
                className="text-gray-700 hover:text-primary-600 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blockchain
              </Link>

              {user ? (
                <>
                  <Link 
                    href="/my-bookings"
                    className="text-gray-700 hover:text-primary-600 font-medium flex items-center justify-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FiCalendar size={16} />
                    <span>My Bookings</span>
                  </Link>
                  <Link 
                    href="/hotels"
                    className="btn-primary text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Book Now
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="btn-secondary text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/hotels"
                    className="btn-primary text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Book Now
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar;
