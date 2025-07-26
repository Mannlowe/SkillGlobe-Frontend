'use client';

import React, { useState } from 'react';
import { Calendar, Briefcase, Building, Globe, Clock, FileText, Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { DndContext, SortableContext, closestCenter, verticalStrategy } from '../ui/dnd-wrapper';
import {
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, entryId: string) => {
    const { name, value } = e.target;
    setExperienceEntries(prev => 
      prev.map(entry => 
        entry.id === entryId ? { ...entry, [name]: value } : entry
      )
    );
    
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
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
    setValidationErrors({});
  };
  
  const validateActiveEntry = () => {
    const activeEntry = experienceEntries.find(entry => entry.id === activeEntryId);
    if (!activeEntry) return false;
    
    const errors: {[key: string]: string} = {};
    
    // Check required fields
    if (!activeEntry.employmentStatus) {
      errors.employmentStatus = 'Employment status is required';
    }
    
    // Set validation errors
    setValidationErrors(errors);
    
    // Return true if no errors
    return Object.keys(errors).length === 0;
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
  
  // Handle drag end event for reordering experience entries
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    if (active.id !== over.id) {
      setExperienceEntries((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Sortable experience item component
  const SortableExperienceItem = ({ entry, onEdit, onRemove }: { 
    entry: ExperienceEntry; 
    onEdit: (id: string) => void; 
    onRemove: (id: string) => void; 
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: entry.id });
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      marginBottom: '12px',
      zIndex: isDragging ? 10 : 0
    };
    
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`p-3 border border-gray-200 rounded-lg ${isDragging ? 'bg-blue-50 shadow-lg' : 'bg-gray-50'}`}
        {...attributes}
      >
        <div className="flex items-center w-full">
          <div
            {...listeners}
            className="mr-3 cursor-grab text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Drag to reorder"
          >
            <GripVertical size={20} />
          </div>
          <div className="flex-grow">
            <h4 className="font-medium text-gray-900">{entry.role || 'Untitled Position'}</h4>
            <p className="text-sm text-gray-600">
              {entry.organization ? `${entry.organization}` : ''}
              {entry.space ? ` - ${entry.space}` : ''}
              {entry.totalExperience ? ` (${entry.totalExperience} years)` : ''}
            </p>
          </div>
          <div className="flex space-x-3 ml-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => onEdit(entry.id)}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Edit experience entry"
            >
              <Pencil size={18} />
            </button>
            <button
              type="button"
              onClick={() => onRemove(entry.id)}
              className="text-red-600 hover:text-red-800"
              aria-label="Remove experience entry"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    );
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
          <div className="mb-6">
            {/* @ts-ignore - Ignoring type error with DndContext */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              {/* @ts-ignore - Ignoring type error with SortableContext */}
              <SortableContext
                items={experienceEntries.map(entry => entry.id)}
                strategy={verticalStrategy}
              >
                {experienceEntries.map((entry) => (
                  <SortableExperienceItem 
                    key={entry.id} 
                    entry={entry} 
                    onEdit={editExperience} 
                    onRemove={removeExperience} 
                  />
                ))}
              </SortableContext>
            </DndContext>
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
                      {validationErrors.employmentStatus && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.employmentStatus}</p>
                      )}
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
        {/* {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        )} */}
        {editMode && (
          <button
            type="button"
            onClick={() => {
              if (validateActiveEntry()) {
                setEditMode(false);
              }
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Add
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
