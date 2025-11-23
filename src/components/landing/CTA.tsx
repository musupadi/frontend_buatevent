'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <span className="text-white text-sm font-semibold">Ready to Get Started?</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Book Your Next Meeting Venue with Confidence
          </h2>

          {/* Subheading */}
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join hundreds of satisfied clients who trust our blockchain-powered 
            platform for transparent, secure, and hassle-free hotel bookings.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/hotels"
              className="w-full sm:w-auto px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl"
            >
              <span>Explore Hotels</span>
              <FiArrowRight />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              Contact Sales
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-white mb-2">21+</div>
              <div className="text-white/80">Premium Hotels</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">42+</div>
              <div className="text-white/80">Meeting Packages</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-white/80">Transparent</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
