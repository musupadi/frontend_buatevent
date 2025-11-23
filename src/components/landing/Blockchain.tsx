'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  FiCpu,
  FiEye,
  FiFileText,
  FiLock,
} from 'react-icons/fi';

export default function Blockchain() {
  const benefits = [
    {
      icon: <FiLock size={24} />,
      title: 'Immutable Records',
      description: 'Every booking is permanently recorded and cannot be altered.',
    },
    {
      icon: <FiEye size={24} />,
      title: 'Full Transparency',
      description: 'Track your booking status in real-time on the blockchain.',
    },
    {
      icon: <FiFileText size={24} />,
      title: 'Smart Contracts',
      description: 'Automated processes ensure fair and secure transactions.',
    },
    {
      icon: <FiCpu size={24} />,
      title: 'Hyperledger Fabric',
      description: 'Enterprise-grade blockchain trusted by Fortune 500 companies.',
    },
  ]

  return (
    <section id="blockchain" className="py-20 bg-gradient-to-br from-gray-900 via-primary-900 to-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <span className="text-sm font-semibold">Powered by Blockchain</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Why Blockchain for Hotel Booking?
            </h2>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              We leverage Hyperledger Fabric to provide enterprise-grade security, transparency, 
              and automation for your hotel reservations. Every transaction is verifiable, 
              traceable, and tamper-proof.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{benefit.title}</h4>
                    <p className="text-sm text-gray-300">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0"
                alt="Blockchain Network"
                fill
                className="object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-transparent" />
              
              {/* Blockchain Stats */}
              <div className="absolute bottom-8 left-8 right-8 space-y-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="text-sm text-gray-300 mb-1">Network Status</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="font-bold">Active & Secured</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-xs text-gray-300">Peer Nodes</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-xs text-gray-300">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
