'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiStar } from 'react-icons/fi';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Budi Santoso',
      role: 'Event Organizer',
      company: 'Jakarta Events Co.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      rating: 5,
      text: 'The blockchain-based booking system gave us complete transparency. We could track every transaction and felt confident about our meeting venue reservation.',
    },
    {
      name: 'Siti Rahma',
      role: 'Corporate HR Manager',
      company: 'PT Mandiri Solutions',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      rating: 5,
      text: 'Auto-calculation feature saved us hours! Just entered the guest count and instantly got accurate pricing. The immutable records are perfect for our audit requirements.',
    },
    {
      name: 'Agus Prasetyo',
      role: 'Wedding Planner',
      company: 'Bali Dream Weddings',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      rating: 5,
      text: 'Booking venues for 100+ guests has never been easier. The platform is intuitive and the blockchain security gives my clients peace of mind.',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-subtitle"
          >
            Trusted by event organizers and corporate clients across Indonesia
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card p-8"
            >
              {/* Stars */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-xs text-gray-500">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
