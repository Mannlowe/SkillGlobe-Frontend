'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { DollarSign, TrendingUp, Calendar, Download, CreditCard } from 'lucide-react';

export default function EarningsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const earningsData = [
    {
      title: 'Total Earnings',
      value: '$12,450',
      change: '+15.3%',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'This Month',
      value: '$2,340',
      change: '+8.7%',
      icon: TrendingUp,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending',
      value: '$890',
      change: '+12.1%',
      icon: Calendar,
      color: 'bg-orange-500',
    },
    {
      title: 'Available',
      value: '$1,450',
      change: '+5.2%',
      icon: CreditCard,
      color: 'bg-purple-500',
    },
  ];

  const transactions = [
    {
      id: 1,
      type: 'payment',
      description: 'Full Stack Development Project',
      client: 'TechCorp Inc.',
      amount: '+$1,200',
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: 2,
      type: 'payment',
      description: 'UI/UX Design Consultation',
      client: 'StartupXYZ',
      amount: '+$800',
      date: '2024-01-12',
      status: 'completed',
    },
    {
      id: 3,
      type: 'withdrawal',
      description: 'Bank Transfer',
      client: 'SkillGlobe',
      amount: '-$500',
      date: '2024-01-10',
      status: 'processed',
    },
    {
      id: 4,
      type: 'payment',
      description: 'React Training Course',
      client: 'Design Studio',
      amount: '+$340',
      date: '2024-01-08',
      status: 'pending',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Earnings</h1>
                <p className="text-gray-600 mt-2">Track your income and manage payouts</p>
              </div>
              
              <button className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                <Download size={16} className="mr-2" />
                Export Report
              </button>
            </div>

            {/* Earnings Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {earningsData.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <span className="text-green-600 text-sm font-medium">{item.change}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{item.value}</h3>
                    <p className="text-gray-600 text-sm">{item.title}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Transactions */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === 'payment' ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                              {transaction.type === 'payment' ? (
                                <TrendingUp className="text-green-600" size={20} />
                              ) : (
                                <CreditCard className="text-blue-600" size={20} />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-sm text-gray-600">{transaction.client}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount}
                            </p>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payout Settings */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Payout Settings</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payout Method
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option>Bank Transfer</option>
                          <option>PayPal</option>
                          <option>Stripe</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Payout
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option>$50</option>
                          <option>$100</option>
                          <option>$200</option>
                        </select>
                      </div>
                      <button className="w-full bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                        Request Payout
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tax Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Tax Information</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <p className="font-medium text-gray-900">Download 1099</p>
                        <p className="text-sm text-gray-600">Tax year 2024</p>
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <p className="font-medium text-gray-900">Tax Settings</p>
                        <p className="text-sm text-gray-600">Update tax information</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}