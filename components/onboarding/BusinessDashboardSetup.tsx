'use client';

import { useState } from 'react';
import { Users, UserPlus, Settings, CheckCircle, Crown, Mail, Link as LinkIcon } from 'lucide-react';

interface BusinessDashboardSetupProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

export default function BusinessDashboardSetup({ data, updateData, nextStep }: BusinessDashboardSetupProps) {
  const [inviteEmails, setInviteEmails] = useState(['']);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['']);

  const userRoles = [
    { id: 'admin', name: 'Admin', description: 'Full access to all features' },
    { id: 'manager', name: 'Manager', description: 'Manage opportunities and candidates' },
    { id: 'poster', name: 'Opportunity Poster', description: 'Create and manage job postings' },
    { id: 'analyst', name: 'Analyst', description: 'View reports and analytics' },
  ];

  const addInviteField = () => {
    setInviteEmails([...inviteEmails, '']);
    setSelectedRoles([...selectedRoles, '']);
  };

  const removeInviteField = (index: number) => {
    setInviteEmails(inviteEmails.filter((_, i) => i !== index));
    setSelectedRoles(selectedRoles.filter((_, i) => i !== index));
  };

  const updateInviteEmail = (index: number, email: string) => {
    const newEmails = [...inviteEmails];
    newEmails[index] = email;
    setInviteEmails(newEmails);
  };

  const updateInviteRole = (index: number, role: string) => {
    const newRoles = [...selectedRoles];
    newRoles[index] = role;
    setSelectedRoles(newRoles);
  };

  const handleComplete = () => {
    const validInvites = inviteEmails
      .map((email, index) => ({ email, role: selectedRoles[index] }))
      .filter(invite => invite.email && invite.role);
    
    updateData({ 
      dashboardSetup: true,
      teamInvites: validInvites
    });
    nextStep();
  };

  const handleSkip = () => {
    updateData({ dashboardSetup: false });
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="text-purple-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Setup Your Business Dashboard
        </h1>
        <p className="text-gray-600">
          Invite team members and configure access permissions
        </p>
        <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mt-2">
          Optional - Setup later
        </div>
      </div>

      {/* Admin Status */}
      <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-4 rounded-xl border border-orange-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <Crown className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Business Admin</h3>
            <p className="text-sm text-gray-600">
              {data.email} - You have full administrative access
            </p>
          </div>
        </div>
      </div>

      {/* Team Invitations */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Invite Team Members</h3>
        
        <div className="space-y-3">
          {inviteEmails.map((email, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => updateInviteEmail(index, e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                    placeholder="colleague@company.com"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <select
                  value={selectedRoles[index]}
                  onChange={(e) => updateInviteRole(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all appearance-none"
                >
                  <option value="">Select role</option>
                  {userRoles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                
                {index > 0 && (
                  <button
                    onClick={() => removeInviteField(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addInviteField}
          className="mt-3 flex items-center text-orange-600 hover:text-orange-700 font-medium"
        >
          <UserPlus size={16} className="mr-2" />
          Add Another Team Member
        </button>
      </div>

      {/* Role Descriptions */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <h3 className="font-semibold text-gray-900 mb-3">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {userRoles.map((role) => (
            <div key={role.id} className="bg-white p-3 rounded-lg">
              <h4 className="font-medium text-gray-900">{role.name}</h4>
              <p className="text-sm text-gray-600">{role.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Types Info */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">User Access Types</h3>
        <div className="space-y-2 text-sm text-blue-700">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
            <p><strong>Internal Users:</strong> Same organization domain (e.g., @yourcompany.com)</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
            <p><strong>External Users:</strong> Any email domain - freelancers, consultants, agencies</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
            <p><strong>Admin Control:</strong> You decide who gets access regardless of email domain</p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-green-50 p-4 rounded-xl border border-green-200">
        <h3 className="font-semibold text-green-900 mb-2">What happens next?</h3>
        <div className="space-y-2 text-sm text-green-700">
          <div className="flex items-center space-x-2">
            <CheckCircle size={14} className="text-green-600" />
            <p>Access your business dashboard with full admin controls</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={14} className="text-green-600" />
            <p>Start posting opportunities and managing candidates</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={14} className="text-green-600" />
            <p>Invited team members will receive email invitations</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={14} className="text-green-600" />
            <p>Manage user access and permissions anytime</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleSkip}
          className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
        >
          Setup Later
        </button>
        <button
          onClick={handleComplete}
          className="flex-1 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          Complete Setup & Enter Dashboard
        </button>
      </div>

      <div className="text-center text-sm text-gray-500">
        You can invite more team members and modify permissions from your dashboard
      </div>
    </div>
  );
}