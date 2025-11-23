'use client'

import Link from 'next/link';
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTwitter,
} from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-white mb-4">HotelChain</h3>
            <p className="text-gray-400 mb-4">
              Blockchain-powered hotel reservation platform for transparent and secure bookings.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiGithub size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiLinkedin size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/hotels" className="hover:text-primary-400 transition-colors">
                  Browse Hotels
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-primary-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/blockchain" className="hover:text-primary-400 transition-colors">
                  Blockchain Tracking
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-primary-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-primary-400 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMail className="flex-shrink-0 mt-1" />
                <span>info@hotelchain.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiPhone className="flex-shrink-0 mt-1" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiMapPin className="flex-shrink-0 mt-1" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} HotelChain. All rights reserved. Powered by Hyperledger Fabric.</p>
        </div>
      </div>
    </footer>
  )
}
