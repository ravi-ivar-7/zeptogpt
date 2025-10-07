'use client'

import { Code, Briefcase, Pen, Palette, GraduationCap, Megaphone, TrendingUp, Sparkles } from 'lucide-react'

const categories = [
  {
    icon: Megaphone,
    name: 'Marketing',
    count: '2,500+',
    gradient: 'from-pink-500 to-rose-500',
    bgGradient: 'from-pink-500/20 to-rose-500/20',
    description: 'Ads, emails, social media'
  },
  {
    icon: Code,
    name: 'Coding',
    count: '1,800+',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    description: 'Debug, document, refactor'
  },
  {
    icon: Pen,
    name: 'Writing',
    count: '2,200+',
    gradient: 'from-purple-500 to-indigo-500',
    bgGradient: 'from-purple-500/20 to-indigo-500/20',
    description: 'Blogs, stories, scripts'
  },
  {
    icon: Briefcase,
    name: 'Business',
    count: '1,500+',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    description: 'Reports, analysis, strategy'
  },
  {
    icon: Palette,
    name: 'Creative',
    count: '1,200+',
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-500/20 to-amber-500/20',
    description: 'Art, design, brainstorming'
  },
  {
    icon: GraduationCap,
    name: 'Education',
    count: '900+',
    gradient: 'from-violet-500 to-purple-500',
    bgGradient: 'from-violet-500/20 to-purple-500/20',
    description: 'Lessons, quizzes, tutoring'
  },
  {
    icon: TrendingUp,
    name: 'SEO',
    count: '800+',
    gradient: 'from-teal-500 to-cyan-500',
    bgGradient: 'from-teal-500/20 to-cyan-500/20',
    description: 'Keywords, meta, content'
  },
  {
    icon: Sparkles,
    name: 'More',
    count: '1,000+',
    gradient: 'from-fuchsia-500 to-pink-500',
    bgGradient: 'from-fuchsia-500/20 to-pink-500/20',
    description: 'And many more...'
  }
]

export default function PromptCategories() {
  return (
    <div className="mb-12 sm:mb-16 px-4 sm:px-0">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
          Explore Prompt Categories
        </h2>
        <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
          Discover premium prompts across every use case
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon
          return (
            <div
              key={index}
              className="group relative p-4 sm:p-6 bg-gradient-to-b from-white/5 via-purple-900/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer hover:scale-105"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${category.bgGradient} rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`h-6 w-6 sm:h-7 sm:w-7 bg-gradient-to-br ${category.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-1 text-center">
                {category.name}
              </h3>
              <p className="text-xs sm:text-sm text-purple-400 font-medium mb-2 text-center">
                {category.count} prompts
              </p>
              <p className="text-xs text-white/60 text-center">
                {category.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
