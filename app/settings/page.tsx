'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { User, Bell, Shield, CreditCard, Globe, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    // { id: 'role', label: 'Role', icon: CreditCard },
    // { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Settings Navigation */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                            activeTab === tab.id
                              ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-500'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon size={20} />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Settings Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  {activeTab === 'profile' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
                      <div className="space-y-6">
                        <div className="flex items-center space-x-6">
                          <img
                            src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                          <div>
                            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                              Change Photo
                            </button>
                            <p className="text-sm text-gray-600 mt-2">JPG, GIF or PNG. 1MB max.</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              defaultValue="Alex"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              defaultValue="Johnson"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            defaultValue="alex.johnson@example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                          </label>
                          <textarea
                            rows={4}
                            defaultValue="Passionate full stack developer with 8+ years of experience..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        
                        <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Email Notifications</h3>
                            <p className="text-sm text-gray-600">Receive notifications via email</p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Push Notifications</h3>
                            <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Job Alerts</h3>
                            <p className="text-sm text-gray-600">Get notified about new job opportunities</p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Course Updates</h3>
                            <p className="text-sm text-gray-600">Notifications about course progress and new courses</p>
                          </div>
                          <input type="checkbox" className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                              </label>
                              <input
                                type="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                              </label>
                              <input
                                type="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                              />
                            </div>
                            <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                              Update Password
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">Enable 2FA</p>
                              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                            </div>
                            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                              Enable
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'role' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Role & Permissions</h2>
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-4">Payment Methods</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <CreditCard className="text-gray-400" size={24} />
                                <div>
                                  <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                                  <p className="text-sm text-gray-600">Expires 12/25</p>
                                </div>
                              </div>
                              <button className="text-orange-600 hover:text-orange-700 font-medium">
                                Edit
                              </button>
                            </div>
                            <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors">
                              + Add Payment Method
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-900 mb-4">Billing History</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">Premium Subscription</p>
                                <p className="text-sm text-gray-600">January 2024</p>
                              </div>
                              <span className="font-medium text-gray-900">$29.99</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'preferences' && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                            <option>UTC-8 (Pacific Time)</option>
                            <option>UTC-5 (Eastern Time)</option>
                            <option>UTC+0 (GMT)</option>
                            <option>UTC+1 (Central European Time)</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">Dark Mode</h3>
                            <p className="text-sm text-gray-600">Switch to dark theme</p>
                          </div>
                          <input type="checkbox" className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded" />
                        </div>
                        
                        <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}