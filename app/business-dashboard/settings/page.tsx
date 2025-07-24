'use client';

import { useState } from 'react';
import Image from 'next/image';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import BusinessDashboardHeader from '@/components/dashboard/BusinessDashboardHeader';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Building2, 
  Users, 
  KeyRound,
  Settings,
  Smartphone
} from 'lucide-react';

export default function BusinessSettingsPage() {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', label: 'Company Details', icon: Building2 },
    // { id: 'team', label: 'Team Members', icon: Users },
    { id: 'admin', label: 'Admin Access', icon: KeyRound },
  ];

  // Sample company data
  const companyData = {
    name: 'SkillGlobe Technologies',
    industry: 'Information Technology',
    size: '50-200 employees',
    website: 'www.skillglobe.com',
    address: '123 Tech Park, Silicon Valley, CA',
    description: 'Leading provider of skill-based recruitment solutions and professional networking.'
  };

  // Sample team members
  const teamMembers = [
    { id: 1, name: 'John Doe', role: 'CEO', email: 'john@skillglobe.com', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' },
    { id: 2, name: 'Jane Smith', role: 'CTO', email: 'jane@skillglobe.com', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' },
    { id: 3, name: 'Mike Johnson', role: 'HR Director', email: 'mike@skillglobe.com', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' },
    { id: 4, name: 'Sarah Williams', role: 'Marketing Manager', email: 'sarah@skillglobe.com', avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' },
  ];

  // Sample admin roles
  const adminRoles = [
    { id: 1, title: 'Super Admin', description: 'Full access to all settings and features', users: 2 },
    { id: 2, title: 'HR Admin', description: 'Access to job postings and applicant data', users: 3 },
    { id: 3, title: 'Content Manager', description: 'Can edit company profile and job descriptions', users: 5 },
    { id: 4, title: 'Viewer', description: 'Read-only access to dashboard and reports', users: 8 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return (
          <div className="bg-white rounded-lg shadow p-6 font-rubik">
            <h2 className="text-xl font-semibold mb-6">Company Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input 
                  type="text" 
                  value={companyData.name} 
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input 
                  type="text" 
                  value={companyData.industry} 
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                <select 
                  value={companyData.size}
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                >
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>50-200 employees</option>
                  <option>201-500 employees</option>
                  <option>500+ employees</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input 
                  type="text" 
                  value={companyData.website} 
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input 
                  type="text" 
                  value={companyData.address} 
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                <textarea 
                  rows={4}
                  value={companyData.description} 
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="bg-white rounded-lg shadow font-rubik">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Team Members</h2>
                <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                  <Users size={16} />
                  Add Member
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative h-10 w-10 rounded-full overflow-hidden">
                            <Image 
                              src={member.avatar} 
                              alt={member.name} 
                              fill 
                              sizes="40px"
                              className="object-cover" 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                        <button className="text-red-500 hover:text-red-700">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'admin':
        return (
          <div className="bg-white rounded-lg shadow font-rubik">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Admin Access Roles</h2>
                <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                  <KeyRound size={16} />
                  Create Role
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {adminRoles.map((role) => (
                <div key={role.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{role.title}</h3>
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {role.users} users
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{role.description}</p>
                  <div className="mt-4 flex justify-end">
                    <button className="text-blue-500 hover:text-blue-700 text-sm">Edit Role</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
            <p className="text-gray-600">Manage your personal profile settings here.</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
            <p className="text-gray-600">Manage your notification settings here.</p>
          </div>
        );
      case 'security':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
            <p className="text-gray-600">Manage your security settings here.</p>
          </div>
        );
      case 'billing':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Billing Information</h2>
            <p className="text-gray-600">Manage your billing settings here.</p>
          </div>
        );
      case 'preferences':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Preferences</h2>
            <p className="text-gray-600">Manage your preferences here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-rubik">
      <BusinessSidebar />
      
      <div className="lg:pl-64 pt-1">
        <BusinessDashboardHeader title="Business Settings" />
        
        <main className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Settings Sidebar */}
            <div className="md:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      className={`w-full flex items-center px-4 py-3 text-left ${
                        activeTab === tab.id 
                          ? 'bg-orange-50 border-r-4 border-orange-500 text-orange-600' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon size={20} className={activeTab === tab.id ? 'text-orange-600' : 'text-gray-500'} />
                      <span className="ml-3 font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Settings Content */}
            <div className="flex-1">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
