'use client';

import React, { useState } from 'react';
import { Calendar, Briefcase, Building, Globe, Clock, FileText, Plus, Pencil, Trash2 } from 'lucide-react';

interface ExperienceEntry {
  id: string;
  employmentStatus: string;
  space: string;
  role: string;
  organization: string;
  website: string;
  totalExperience: string;
  noticePeriod: string;
  professionalSummary: string;
}

interface ExperienceFormProps {
  onSave?: (data: ExperienceEntry[]) => void;
  onCancel?: () => void;
  initialData?: ExperienceEntry[];
}

export default function ExperienceForm({ onSave, onCancel, initialData = [] }: ExperienceFormProps) {
  const [experienceEntries, setExperienceEntries] = useState<ExperienceEntry[]>(
    initialData.length > 0 ? initialData : [
      {
        id: crypto.randomUUID(),
        employmentStatus: '',
        space: '',
        role: '',
        organization: '',
        website: '',
        totalExperience: '',
        noticePeriod: '',
        professionalSummary: '',
      }
    ]
  );
  
  const [activeEntryId, setActiveEntryId] = useState<string>(experienceEntries[0]?.id || '');
  const [editMode, setEditMode] = useState<boolean>(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, entryId: string) => {
    const { name, value } = e.target;
    setExperienceEntries(prev => 
      prev.map(entry => 
        entry.id === entryId ? { ...entry, [name]: value } : entry
      )
    );
  };
  
  const addNewExperience = () => {
    const newEntry: ExperienceEntry = {
      id: crypto.randomUUID(),
      employmentStatus: '',
      space: '',
      role: '',
      organization: '',
      website: '',
      totalExperience: '',
      noticePeriod: '',
      professionalSummary: '',
    };
    
    setExperienceEntries(prev => [newEntry, ...prev]);
    setActiveEntryId(newEntry.id);
    setEditMode(true);
  };
  
  const removeExperience = (entryId: string) => {
    setExperienceEntries(prev => prev.filter(entry => entry.id !== entryId));
    
    // If we removed the active entry, set the first remaining entry as active
    if (activeEntryId === entryId) {
      const remainingEntries = experienceEntries.filter(entry => entry.id !== entryId);
      if (remainingEntries.length > 0) {
        setActiveEntryId(remainingEntries[0].id);
      } else {
        // If no entries left, add a new empty one
        addNewExperience();
      }
    }
  };
  
  const editExperience = (entryId: string) => {
    setActiveEntryId(entryId);
    setEditMode(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(experienceEntries);
    }
  };

  // Validate website URL
  const validateWebsite = (url: string) => {
    return url === '' || /^https?:\/\/.*/.test(url);
  };

  // Validate experience (numeric with optional decimal)
  const validateExperience = (exp: string) => {
    return exp === '' || /^\d+(\.\d+)?$/.test(exp);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Experience Information</h3>
          <button
            type="button"
            onClick={addNewExperience}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus size={16} className="mr-1" /> Add Experience
          </button>
        </div>
        
        {/* Experience entries list */}
        {!editMode && experienceEntries.length > 0 && (
          <div className="mb-6 space-y-3">
            {experienceEntries.map((entry) => (
              <div key={entry.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">{entry.role || 'Untitled Position'}</h4>
                  <p className="text-sm text-gray-600">
                    {entry.organization ? `${entry.organization}` : ''}
                    {entry.space ? ` - ${entry.space}` : ''}
                    {entry.totalExperience ? ` (${entry.totalExperience} years)` : ''}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    type="button" 
                    onClick={() => editExperience(entry.id)}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="Edit experience entry"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => removeExperience(entry.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Remove experience entry"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Experience form */}
        {editMode && activeEntryId && (
          <div>
            {experienceEntries.length > 1 && (
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <h4 className="font-medium text-gray-900">
                  {experienceEntries.find(e => e.id === activeEntryId)?.role || 'New Experience'}
                </h4>
                <button 
                  type="button" 
                  onClick={() => setEditMode(false)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Back to List
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experienceEntries.map(entry => (
                entry.id === activeEntryId && (
                  <React.Fragment key={entry.id}>
                    {/* Employment Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employment Status <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <select
                          name="employmentStatus"
                          value={entry.employmentStatus}
                          onChange={(e) => handleInputChange(e, entry.id)}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                          <option value="">Select status</option>
                          <option value="Working">Working</option>
                          <option value="Not Working">Not Working</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Space/Industry */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Space
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <select
                          name="space"
                          value={entry.space}
                          onChange={(e) => handleInputChange(e, entry.id)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                          <option value="">Select industry</option>
                          <option value="IT">IT</option>
                          <option value="Education & Training">Education & Training</option>
                          <option value="Finance">Finance</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Role/Designation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role / Designation
                      </label>
                      <input
                        type="text"
                        name="role"
                        value={entry.role}
                        onChange={(e) => handleInputChange(e, entry.id)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your job title or designation"
                      />
                    </div>
                    
                    {/* Work Organization */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Organization
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={entry.organization}
                        onChange={(e) => handleInputChange(e, entry.id)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Last company / organization name"
                      />
                    </div>
                    
                    {/* Website */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          name="website"
                          value={entry.website}
                          onChange={(e) => handleInputChange(e, entry.id)}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            entry.website && !validateWebsite(entry.website) 
                              ? 'border-red-500' 
                              : 'border-gray-300'
                          }`}
                          placeholder="https://example.com"
                        />
                      </div>
                      {entry.website && !validateWebsite(entry.website) && (
                        <p className="text-xs text-red-500 mt-1">URL must start with http:// or https://</p>
                      )}
                    </div>
                    
                    {/* Total Experience */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Experience
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          name="totalExperience"
                          value={entry.totalExperience}
                          onChange={(e) => handleInputChange(e, entry.id)}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            entry.totalExperience && !validateExperience(entry.totalExperience) 
                              ? 'border-red-500' 
                              : 'border-gray-300'
                          }`}
                          placeholder="e.g., 5.5"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Total experience in years (e.g., 5, 6.5)</p>
                      {entry.totalExperience && !validateExperience(entry.totalExperience) && (
                        <p className="text-xs text-red-500 mt-1">Enter a valid number</p>
                      )}
                    </div>
                    
                    {/* Notice Period */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notice Period
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <select
                          name="noticePeriod"
                          value={entry.noticePeriod}
                          onChange={(e) => handleInputChange(e, entry.id)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                          <option value="">Select notice period</option>
                          <option value="Immediate">Immediate</option>
                          <option value="15 Days">15 Days</option>
                          <option value="30 Days">30 Days</option>
                          <option value="60 Days">60 Days</option>
                        </select>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">For working professionals</p>
                    </div>
                    
                    {/* Professional Summary */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Professional Summary
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                        <textarea
                          name="professionalSummary"
                          value={entry.professionalSummary}
                          onChange={(e) => handleInputChange(e, entry.id)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                          placeholder="Short paragraph describing experience & strengths"
                        />
                      </div>
                    </div>
                  </React.Fragment>
                )
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        {editMode && (
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Done Editing
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          {experienceEntries.length > 0 ? 'Save Experience' : 'Skip Experience'}
        </button>
      </div>
    </form>
  );
}
