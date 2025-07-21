'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Briefcase, 
  Calendar,
  X,
  Pencil,
  Trash2,
  Plus,
  FileText,
  Upload
} from 'lucide-react';

interface ProfileFormProps {
  onSave: (data: ProfileEntry[]) => void;
  onCancel: () => void;
  initialData?: ProfileEntry[];
}

export interface ProfileEntry {
  id: string;
  role: string;
  employmentType: string;
  natureOfWork: string;
  workMode: string;
  minimumEarnings?: string;
  currency?: string;
  preferredCity?: string;
  preferredCountry?: string;
  totalExperience?: string;
  relevantExperience?: string;
  resume?: File | null;
}

export default function ProfileForm({ onSave, onCancel, initialData = [] }: ProfileFormProps) {
  const [profileEntries, setProfileEntries] = useState<ProfileEntry[]>(
    initialData.length > 0 ? initialData : []
  );
  
  const [editingEntry, setEditingEntry] = useState<ProfileEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [activeSection, setActiveSection] = useState('resume');
  
  const employmentTypes = ['Permanent', 'Contract', 'Internship'];
  const workNatures = ['Full-time', 'Part-time'];
  const workModes = ['WFO', 'WFH', 'Hybrid', 'No Preference'];

  const handleAddProfile = () => {
    setEditingEntry({
      id: crypto.randomUUID(),
      role: '',
      employmentType: '',
      natureOfWork: '',
      workMode: '',
      minimumEarnings: '',
      currency: '',
      preferredCity: '',
      preferredCountry: '',
      totalExperience: '',
      relevantExperience: '',
      resume: null
    });
    setIsEditing(true);
  };

  const handleEditProfile = (entry: ProfileEntry) => {
    setEditingEntry({ ...entry });
    setIsEditing(true);
  };

  const handleDeleteProfile = (id: string) => {
    setProfileEntries(profileEntries.filter(entry => entry.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingEntry) {
      setEditingEntry({
        ...editingEntry,
        [name]: value
      });
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeUploaded(true);
      // After resume is uploaded, automatically switch to personal info section
      setTimeout(() => {
        setActiveSection('personal');
      }, 1000);
    }
  };

  const handleSaveEntry = () => {
    if (!editingEntry) return;
    
    // Validation
    if (!editingEntry.role || !editingEntry.employmentType || !editingEntry.natureOfWork || !editingEntry.workMode) {
      alert('Please fill in all required fields');
      return;
    }

    // If editing existing entry, update it
    if (profileEntries.some(entry => entry.id === editingEntry.id)) {
      setProfileEntries(profileEntries.map(entry => 
        entry.id === editingEntry.id ? editingEntry : entry
      ));
    } else {
      // Otherwise add new entry
      setProfileEntries([...profileEntries, editingEntry]);
    }
    
    setEditingEntry(null);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profileEntries);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-rubik">
      {!isEditing ? (
        <>
          {profileEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="bg-blue-50 rounded-full p-4 mb-4">
                <Briefcase className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles created yet</h3>
              <p className="text-gray-500 text-center mb-6">Create a profile to showcase your professional details and preferences</p>
              <button
                type="button"
                onClick={handleAddProfile}
                className="btn-gradient-border py-2 px-4 rounded-lg flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Profile
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Profiles</h2>
                <button
                  type="button"
                  onClick={handleAddProfile}
                  className="btn-gradient-border py-2 px-4 rounded-lg flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Profile
                </button>
              </div>
              
              <div className="space-y-4">
                {profileEntries.map((entry) => (
                  // eslint-disable-next-line react/jsx-key
                  <div className='grid grid-cols-2 gap-2'>
                  <div key={entry.id} className="bg-white p-4 rounded-lg shadow-2xl border border-gray-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg text-gray-900">{entry.role}</h3>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Briefcase className="h-4 w-4 mr-2" />
                            <span>{entry.employmentType} · {entry.natureOfWork} · {entry.workMode}</span>
                          </div>
                          {entry.preferredCity && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{entry.preferredCity}{entry.preferredCountry ? `, ${entry.preferredCountry}` : ''}</span>
                            </div>
                          )}
                          {entry.totalExperience && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{entry.totalExperience} years experience</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditProfile(entry)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          aria-label="Edit profile"
                        >
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProfile(entry.id)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          aria-label="Delete profile"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
              
              {/* <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Profiles
                </button>
              </div> */}
            </>
          )}
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">
              {editingEntry && profileEntries.some(e => e.id === editingEntry.id) 
                ? 'Edit Profile' 
                : 'Add New Profile'}
            </h3>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Required Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="role"
                value={editingEntry?.role || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Full Stack Developer"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select
                name="employmentType"
                value={editingEntry?.employmentType || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Employment Type</option>
                {employmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nature of Work <span className="text-red-500">*</span>
              </label>
              <select
                name="natureOfWork"
                value={editingEntry?.natureOfWork || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Nature of Work</option>
                {workNatures.map(nature => (
                  <option key={nature} value={nature}>{nature}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Mode <span className="text-red-500">*</span>
              </label>
              <select
                name="workMode"
                value={editingEntry?.workMode || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Work Mode</option>
                {workModes.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
            </div>
            
            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Earnings
                </label>
                <input
                  type="text"
                  name="minimumEarnings"
                  value={editingEntry?.minimumEarnings || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 75000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <input
                  type="text"
                  name="currency"
                  value={editingEntry?.currency || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. INR, USD"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred City
                </label>
                <input
                  type="text"
                  name="preferredCity"
                  value={editingEntry?.preferredCity || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Bangalore"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Country
                </label>
                <input
                  type="text"
                  name="preferredCountry"
                  value={editingEntry?.preferredCountry || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. India"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Experience (years)
                </label>
                <input
                  type="text"
                  name="totalExperience"
                  value={editingEntry?.totalExperience || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relevant Experience (years)
                </label>
                <input
                  type="text"
                  name="relevantExperience"
                  value={editingEntry?.relevantExperience || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 3"
                />
              </div>
            </div>
            
            <div>
            <h3 className="font-semibold text-gray-900 mb-3">Resume Upload & Smart Parsing</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload your resume and we&apos;ll automatically extract your information to build your profile
            </p>
            
            {!resumeUploaded ? (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors cursor-pointer">
                  <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-sm font-medium text-gray-900">Upload your resume</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (max 10MB)</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FileText className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Resume uploaded successfully!</p>
                    <p className="text-sm text-gray-600">We&apos;re parsing your information...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEntry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
