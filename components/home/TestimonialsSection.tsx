'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Full Stack Developer',
    company: 'TechCorp',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'SkillGlobe transformed my career. The AI matching helped me find the perfect remote position that aligns with my skills and lifestyle.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'UX Designer',
    company: 'DesignStudio',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The platform\'s learning recommendations helped me upskill in emerging technologies. Now I\'m leading design projects I never thought possible.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Consultant',
    company: 'Freelancer',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'I\'ve built a thriving consulting business through SkillGlobe. The client matching system is incredibly accurate and saves me hours of prospecting.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from professionals who've transformed their careers with SkillGlobe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="skillglobe-card p-6 md:p-8 relative"
            >
              <Quote className="absolute top-4 right-4 text-orange-200" size={32} />
              
              <div className="flex items-center mb-4 md:mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 text-xs md:text-sm">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={16} />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}