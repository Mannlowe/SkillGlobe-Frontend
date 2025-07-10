'use client';

import React, { useState } from 'react';
import { Calendar, BookOpen, Award, Upload, GraduationCap, School, Plus, Pencil, Trash2 } from 'lucide-react';

interface EducationEntry {
  id: string;
  educationLevel: string;
  yearOfCompletion: string;
  stream: string;
  score: string;
  university: string;
  certificateFile: File | null;
  certificateFileName?: string;
}

interface EducationFormProps {
  onSave?: (data: EducationEntry[]) => void;
  onCancel?: () => void;
  initialData?: EducationEntry[];
}

export default function EducationForm({ onSave, onCancel, initialData = [] }: EducationFormProps) {
  const [educationEntries, setEducationEntries] = useState<EducationEntry[]>(
    initialData.length > 0 ? initialData : [
      {
        id: crypto.randomUUID(),
        educationLevel: '',
        yearOfCompletion: '',
        stream: '',
        score: '',
        university: '',
        certificateFile: null,
      }
    ]
  );
  
  const [activeEntryId, setActiveEntryId] = useState<string>(educationEntries[0]?.id || '');
  const [editMode, setEditMode] = useState<boolean>(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, entryId: string) => {
    const { name, value } = e.target;
    setEducationEntries(prev => 
      prev.map(entry => 
        entry.id === entryId ? { ...entry, [name]: value } : entry
      )
    );
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>, entryId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setEducationEntries(prev => 
        prev.map(entry => 
          entry.id === entryId ? { 
            ...entry, 
            certificateFile: file,
            certificateFileName: file.name
          } : entry
        )
      );
    }
  };
  
  const addNewEducation = () => {
    const newEntry: EducationEntry = {
      id: crypto.randomUUID(),
      educationLevel: '',
      yearOfCompletion: '',
      stream: '',
      score: '',
      university: '',
      certificateFile: null,
    };
    
    setEducationEntries(prev => [newEntry, ...prev]);
    setActiveEntryId(newEntry.id);
    setEditMode(true);
  };
  
  const removeEducation = (entryId: string) => {
    setEducationEntries(prev => prev.filter(entry => entry.id !== entryId));
    
    // If we removed the active entry, set the first remaining entry as active
    if (activeEntryId === entryId) {
      const remainingEntries = educationEntries.filter(entry => entry.id !== entryId);
      if (remainingEntries.length > 0) {
        setActiveEntryId(remainingEntries[0].id);
      } else {
        // If no entries left, add a new empty one
        addNewEducation();
      }
    }
  };
  
  const editEducation = (entryId: string) => {
    setActiveEntryId(entryId);
    setEditMode(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(educationEntries);
    }
  };

  // Validate year is 4 digits
  const validateYear = (year: string) => {
    return /^\d{4}$/.test(year);
  };

  // Validate score is a number or percentage
  const validateScore = (score: string) => {
    return score === '' || /^(\d+(\.\d+)?|\d+%)$/.test(score);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Education Information</h3>
          <button
            type="button"
            onClick={addNewEducation}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus size={16} className="mr-1" /> Add Education
          </button>
        </div>
        
        {/* Education entries list */}
        {!editMode && educationEntries.length > 0 && (
          <div className="mb-6 space-y-3">
            {educationEntries.map((entry) => (
              <div key={entry.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">{entry.educationLevel || 'Untitled Education'}</h4>
                  <p className="text-sm text-gray-600">
                    {entry.university ? `${entry.university}, ` : ''}
                    {entry.yearOfCompletion ? `${entry.yearOfCompletion}` : ''}
                    {entry.stream ? ` - ${entry.stream}` : ''}
                    {entry.score ? ` (${entry.score})` : ''}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    type="button" 
                    onClick={() => editEducation(entry.id)}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="Edit education entry"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => removeEducation(entry.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Remove education entry"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Education form */}
        {editMode && activeEntryId && (
          <div>
            {educationEntries.length > 1 && (
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <h4 className="font-medium text-gray-900">
                  {educationEntries.find(e => e.id === activeEntryId)?.educationLevel || 'New Education'}
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
              {educationEntries.map(entry => (
                entry.id === activeEntryId && (
                  <React.Fragment key={entry.id}>
                    {/* Education Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Education Level <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <select
                          name="educationLevel"
                          value={entry.educationLevel}
                          onChange={(e) => handleInputChange(e, entry.id)}
                          required
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                          <option value="">Select education level</option>
                          <option value="SSC">SSC</option>
                          <option value="HSC">HSC</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Graduation">Graduation</option>
                          <option value="Post Graduation">Post Graduation</option>
                        </select>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Latest qualification at top</p>
                    </div>
                    
                    {/* Year of Completion */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year of Completion <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          name="yearOfCompletion"
                          value={entry.yearOfCompletion}
                          onChange={(e) => handleInputChange(e, entry.id)}
                          required
                          maxLength={4}
                          pattern="\d{4}"
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            entry.yearOfCompletion && !validateYear(entry.yearOfCompletion) 
                              ? 'border-red-500' 
                              : 'border-gray-300'
                          }`}
                          placeholder="YYYY"
                        />
                      </div>
                      {entry.yearOfCompletion && !validateYear(entry.yearOfCompletion) && (
                        <p className="text-xs text-red-500 mt-1">Must be 4 digits (e.g., 2020)</p>
                      )}
                      {validateYear(entry.yearOfCompletion) && (
                        <p className="text-xs text-gray-500 mt-1">Must be 4 digits (e.g., 2020)</p>
                      )}
                    </div>
                    
                    {/* Stream */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stream
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          name="stream"
                          value={entry.stream}
                          onChange={(e) => handleInputChange(e, entry.id)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="E.g., Science, Commerce, IT"
                        />
                      </div>
                    </div>
                    
                    {/* Score */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Score
                      </label>
                      <input
                        type="text"
                        name="score"
                        value={entry.score}
                        onChange={(e) => handleInputChange(e, entry.id)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          entry.score && !validateScore(entry.score) 
                            ? 'border-red-500' 
                            : 'border-gray-300'
                        }`}
                        placeholder="E.g., 85% or 3.8 CGPA"
                      />
                      {entry.score && !validateScore(entry.score) && (
                        <p className="text-xs text-red-500 mt-1">Enter a valid score (number or percentage)</p>
                      )}
                      {validateScore(entry.score) && (
                        <p className="text-xs text-gray-500 mt-1">%, CGPA or other scoring system</p>
                      )}
                    </div>
                    
                    {/* University/Board */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        University/Board
                      </label>
                      <div className="relative">
                        <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          name="university"
                          value={entry.university}
                          onChange={(e) => handleInputChange(e, entry.id)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Name of University or Board"
                        />
                      </div>
                    </div>
                    
                    {/* Certificate Upload */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Certificate Upload
                      </label>
                      
                      {!entry.certificateFileName ? (
                        <label className="block">
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <Upload className="mx-auto text-gray-400 mb-2" size={20} />
                            <p className="text-sm font-medium text-gray-900">Upload Certificate</p>
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 5MB)</p>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleCertificateUpload(e, entry.id)}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <Award className="text-blue-500 mr-2" size={18} />
                            <div>
                              <p className="text-sm font-medium text-blue-900">{entry.certificateFileName}</p>
                              <p className="text-xs text-blue-700">Certificate uploaded successfully</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              setEducationEntries(prev => 
                                prev.map(e => 
                                  e.id === entry.id ? { 
                                    ...e, 
                                    certificateFile: null,
                                    certificateFileName: undefined
                                  } : e
                                )
                              );
                            }}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Upload marksheet, degree certificate, etc.</p>
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
          {educationEntries.length > 0 ? 'Save Education' : 'Skip Education'}
        </button>
      </div>
    </form>
  );
}
