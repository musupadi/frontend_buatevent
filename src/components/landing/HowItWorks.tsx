'use client'

import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiCheckCircle,
  FiSearch,
} from 'react-icons/fi';

export default function HowItWorks() {
  const steps = [
    {
      icon: <FiSearch size={32} />,
      step: '01',
      title: 'Choose Your Hotel',
      description: 'Browse 21+ premium hotels across Indonesia with verified meeting packages.',
    },
    {
      icon: <FiCalendar size={32} />,
      step: '02',
      title: 'Enter Guest Details',
      description: 'Specify your event type, guest count, and dates. Get instant price calculation.',
    },
    {
      icon: <FiCheckCircle size={32} />,
      step: '03',
      title: 'Confirm & Pay',
      description: 'Your booking is secured on blockchain with immutable record and instant confirmation.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-subtitle"
          >
            Book your meeting venue in 3 simple steps
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-secondary-200 to-primary-200 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                {/* Step Number */}
                <div className="inline-block mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-xl">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white border-4 border-primary-500 flex items-center justify-center font-bold text-primary-700">
                      {step.step}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
