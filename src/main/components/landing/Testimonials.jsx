'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Marketing Director',
    company: 'TechFlow Inc',
    image: '👩‍💼',
    rating: 5,
    text: 'ZepToGPT has transformed our content workflow. The instant execution saves us hours every week, and the quality of prompts is outstanding.'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Freelance Developer',
    company: 'Independent',
    image: '👨‍💻',
    rating: 5,
    text: 'As a seller, I\'ve earned over $5,000 in my first month. The platform makes it incredibly easy to monetize my prompt engineering skills.'
  },
  {
    name: 'Emily Watson',
    role: 'Content Creator',
    company: 'Creative Studios',
    image: '👩‍🎨',
    rating: 5,
    text: 'The execution speed is insane! I can test multiple prompts in seconds. This is exactly what the AI community needed.'
  },
  {
    name: 'David Kim',
    role: 'Startup Founder',
    company: 'AI Ventures',
    image: '👨‍💼',
    rating: 5,
    text: 'We use ZepToGPT for all our AI needs. The marketplace has prompts for everything, and the API integration is seamless.'
  }
]

export default function Testimonials() {
  return (
    <div className="mb-12 sm:mb-16 px-4 sm:px-0">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
          Loved by Thousands
        </h2>
        <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
          See what our community has to say
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="relative p-6 sm:p-8 bg-gradient-to-b from-white/5 via-purple-900/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
          >
            <Quote className="absolute top-4 right-4 h-8 w-8 text-purple-500/20" />
            
            <div className="flex items-start space-x-4 mb-4">
              <div className="text-4xl">{testimonial.image}</div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                <p className="text-sm text-white/60">{testimonial.role}</p>
                <p className="text-xs text-purple-400">{testimonial.company}</p>
              </div>
              <div className="flex space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            
            <p className="text-white/80 leading-relaxed italic">
              "{testimonial.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
