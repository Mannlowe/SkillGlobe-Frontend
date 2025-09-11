'use client';

import { Brain, Users, TrendingUp, Shield, Zap, Globe } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description: 'Our intelligent algorithms connect you with the perfect opportunities based on your skills and preferences.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Global Network',
    description: 'Connect with professionals, businesses, and trainers from around the world in our thriving ecosystem.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    title: 'Skill Development',
    description: 'Access personalized learning paths and upskill with courses tailored to market demands.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Globe,
    title: 'Curated Profiles',
    description: 'We creates verified profiles, letting candidates showcase skills and employers highlight opportunities, ensuring mutual trust.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Your data and transactions are protected with enterprise-grade security and privacy measures.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Zap,
    title: 'Instant Opportunities',
    description: 'Get real-time notifications for jobs and projects that match your expertise and availability.',
    color: 'from-yellow-500 to-orange-500',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-orange-500">Skill</span><span className="text-blue-500">Globe</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of talent management with our comprehensive platform designed for the modern workforce
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="skillglobe-card p-6 md:p-8 group hover:scale-105 transition-all duration-300"
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}