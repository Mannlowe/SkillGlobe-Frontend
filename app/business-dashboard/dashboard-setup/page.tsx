'use client';

import { useState } from 'react';
import { Users, UserPlus, Edit, Trash2, X } from 'lucide-react';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';
import BusinessDashboardHeader from '@/components/dashboard/BusinessDashboardHeader';
import Image from 'next/image';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
};

export default function AdminAccessPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string>('');
  
  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  
  // Team members state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'John Doe',
      role: 'CEO',
      email: 'john@skillglobe.com',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'CTO',
      email: 'jane@skillglobe.com',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      role: 'HR Director',
      email: 'mike@skillglobe.com',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
      id: '4',
      name: 'Sarah Williams',
      role: 'Marketing Manager',
      email: 'sarah@skillglobe.com',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    }
  ]);

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentMember(null);
    setName('');
    setRole('');
    setEmail('');
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setIsEditMode(true);
    setCurrentMember(member);
    setName(member.name);
    setRole(member.role);
    setEmail(member.email);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !role || !email) {
      alert('Please fill in all fields');
      return;
    }

    if (isEditMode && currentMember) {
      // Update existing member
      setTeamMembers(teamMembers.map(member => 
        member.id === currentMember.id ? {
          ...member,
          name,
          role,
          email
        } : member
      ));
    } else {
      // Add new member
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name,
        role,
        email,
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`
      };
      
      setTeamMembers([...teamMembers, newMember]);
    }
    
    closeModal();
  };

  const openDeleteModal = (id: string, name: string) => {
    setMemberToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setMemberToDelete('');
  };

  const handleRemove = () => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberToDelete));
    closeDeleteModal();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <BusinessSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 transition-all duration-300" style={{ marginLeft: isMenuOpen ? '0' : '' }}>
        <BusinessDashboardHeader 
          title="Admin Access" 
          onMenuClick={() => setIsMenuOpen(!isMenuOpen)} 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-full mx-auto bg-white rounded-xl shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
              <button 
                onClick={openAddModal}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center"
              >
                <UserPlus size={18} className="mr-2" />
                Add Member
              </button>
            </div>
            
            {/* Team Members Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-8 font-medium text-gray-600">NAME</th>
                    <th className="text-left py-3 px-8 font-medium text-gray-600">ROLE</th>
                    <th className="text-left py-3 px-8 font-medium text-gray-600">EMAIL</th>
                    <th className="text-right py-3 px-8 font-medium text-gray-600">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <Image 
                              src={member.avatar} 
                              alt={member.name} 
                              width={40} 
                              height={40} 
                              className="object-cover"
                            />
                          </div>
                          <span className="font-medium text-gray-900">{member.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-8 text-gray-700">{member.role}</td>
                      <td className="py-4 px-8 text-gray-700">{member.email}</td>
                      <td className="py-4 px-8 text-right">
                        <div className="flex justify-end space-x-6">
                          <button 
                            onClick={() => openEditModal(member)}
                            className="p-1.5 bg-blue-50 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-md transition-colors"
                            title="Edit member"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(member.id, member.name)}
                            className="p-1.5 bg-red-50 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
                            title="Remove member"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-500" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Confirm Removal
              </h3>
              <p className="text-gray-600">
                Are you sure you want to remove this team member?
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="px-6 py-2 bg-red-500 rounded-lg text-white font-medium hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {isEditMode ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Job title or role"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@example.com"
                  required
                />
              </div>
              
              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  className="w-60 bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 transition-all duration-300"
                >
                  {isEditMode ? 'Save Changes' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}