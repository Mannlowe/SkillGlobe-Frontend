'use client';

import { Code, Palette, Camera, PenTool, Megaphone, BarChart, Wrench, Heart } from 'lucide-react';

const categories = [
  { icon: Code, name: 'Technology', count: '2.5K+ jobs', color: 'bg-blue-500' },
  { icon: Palette, name: 'Design', count: '1.8K+ jobs', color: 'bg-purple-500' },
  { icon: Camera, name: 'Media', count: '1.2K+ jobs', color: 'bg-pink-500' },
  { icon: PenTool, name: 'Writing', count: '950+ jobs', color: 'bg-green-500' },
  { icon: Megaphone, name: 'Marketing', count: '1.5K+ jobs', color: 'bg-orange-500' },
  { icon: BarChart, name: 'Business', count: '2.1K+ jobs', color: 'bg-indigo-500' },
  { icon: Wrench, name: 'Engineering', count: '1.7K+ jobs', color: 'bg-gray-500' },
  { icon: Heart, name: 'Healthcare', count: '890+ jobs', color: 'bg-red-500' },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover opportunities across diverse industries and skill sets
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="skillglobe-card p-4 md:p-6 text-center group cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="text-white" size={20} />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.count}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <button className="skillglobe-button">
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
}