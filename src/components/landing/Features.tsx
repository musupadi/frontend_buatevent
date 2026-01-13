'use client'

import { motion } from 'framer-motion';
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiGlobe,
  FiShield,
  FiZap,
} from 'react-icons/fi';

export default function Features() {
  const features = [
    {
      icon: <FiShield size={32} />,
      title: 'Blockchain Security',
      description: 'Immutable records powered by Hyperledger Fabric ensure your bookings are secure and transparent.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FiDollarSign size={32} />,
      title: 'Transparent Pricing',
      description: 'No hidden fees. Auto-calculated prices based on guest count with full breakdown.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <FiZap size={32} />,
      title: 'Instant Confirmation',
      description: 'Real-time booking confirmation with smart contract automation.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <FiClock size={32} />,
      title: '24/7 Availability',
      description: 'Book anytime, anywhere. Our system never sleeps.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <FiCheckCircle size={32} />,
      title: 'Verified Hotels',
      description: '21+ premium hotels across Indonesia with verified meeting packages.',
      color: 'from-red-500 to-rose-500',
    },
    {
      icon: <FiGlobe size={32} />,
      title: 'Multi-Location',
      description: 'Hotels in Bandung, Bogor, Bali, Jakarta, Yogyakarta, and more.',
      color: 'from-indigo-500 to-blue-500',
    },
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Why Choose BuatEvent?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-subtitle"
          >
            Experience the future of hotel booking with blockchain technology
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card p-8 hover:scale-105 transition-transform duration-300"
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6`}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
