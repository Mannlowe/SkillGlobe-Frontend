'use client';

import React, { useState, useEffect } from 'react';
import { useExperienceStore } from '@/store/portfolio/addexperienceStore';
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
  relevantExperience: string;
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
        relevantExperience: '',
        professionalSummary: '',
      }
    ]
  );

  const [activeEntryId, setActiveEntryId] = useState<string>(experienceEntries[0]?.id || '');
  const [editMode, setEditMode] = useState<boolean>(true);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

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
      professionalSummary: '',
      relevantExperience: '',
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

    const errors: { [key: string]: string } = {};

    // Mandatory fields
    if (!activeEntry.space) {
      errors.space = 'Industry is required';
    }
    if (!activeEntry.role) {
      errors.role = 'Role / Designation is required';
    }
    if (!activeEntry.organization) {
      errors.organization = 'Work organization is required';
    }
    if (!activeEntry.relevantExperience) {
      errors.relevantExperience = 'Relevant experience is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const { uploadExperience, isUploading, uploadSuccess, uploadError, resetUploadState } = useExperienceStore();

  useEffect(() => {
    // Reset upload state when component mounts
    resetUploadState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If there are no entries or we're in edit mode, just call onSave
    if (experienceEntries.length === 0 || editMode) {
      if (onSave) {
        onSave(experienceEntries);
      }
      return;
    }

    // Try to upload each experience entry
    try {
      for (const entry of experienceEntries) {
        await uploadExperience(entry);
      }
      
      // Call onSave after successful upload
      if (onSave) {
        onSave(experienceEntries);
      }
    } catch (error) {
      console.error('Failed to upload experience entries:', error);
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
      <div className="bg-white p-6 rounded-xl shadow-lg">
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
            {experienceEntries.length > 0 && (
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

<div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relevant Experience  <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          name="relevantExperience"
                          value={entry.relevantExperience}
                          onChange={(e) => handleInputChange(e, entry.id)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Relevant experience"
                        />
                      </div>
                      {validationErrors.relevantExperience && (
                        <p className="text-sm text-red-600 mt-1">{validationErrors.relevantExperience}</p>
                      )}
                    </div>

                    {/* Space/Industry */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Space  <span className="text-red-500">*</span>
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
                          <option value="Testing">Testing</option>
                          <option value="Education & Training">Education & Training</option>
                          <option value="Finance">Finance</option>
                        </select>
                      </div>
                      {validationErrors.space && (
                        <p className="text-sm text-red-600 mt-1">{validationErrors.space}</p>
                      )}
                    </div>

                    {/* Role/Designation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role / Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="role"
                        value={entry.role}
                        onChange={(e) => handleInputChange(e, entry.id)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your job title or designation"
                      />
                      {validationErrors.role && (
                        <p className="text-sm text-red-600 mt-1">{validationErrors.role}</p>
                      )}
                    </div>

                    {/* Work Organization */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Organization <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="organization"
                        value={entry.organization}
                        onChange={(e) => handleInputChange(e, entry.id)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Last company / organization name"
                      />
                      {validationErrors.organization && (
                        <p className="text-sm text-red-600 mt-1">{validationErrors.organization}</p>
                      )}
                    </div>
                  </React.Fragment>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <p>Error: {uploadError}</p>
        </div>
      )}

      {uploadSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <p>Work experience details saved successfully!</p>
        </div>
      )}

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
            onClick={async () => {
              if (validateActiveEntry()) {
                // Get the active entry
                const activeEntry = experienceEntries.find(entry => entry.id === activeEntryId);
                if (activeEntry) {
                  try {
                    // Upload the experience entry
                    await uploadExperience(activeEntry);
                    // Only set editMode to false if upload was successful
                    if (!uploadError) {
                      setEditMode(false);
                    }
                  } catch (error) {
                    console.error('Failed to upload experience entry:', error);
                  }
                }
              }
            }}
            disabled={isUploading}
            className={`px-4 py-2 border border-gray-300 text-gray-700 rounded-lg ${isUploading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'} flex items-center`}
          >
            {isUploading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isUploading ? 'Adding...' : 'Add'}
          </button>
        )}
        <button
          type="submit"
          disabled={isUploading}
          className={`px-6 py-2 ${isUploading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium rounded-lg transition-colors flex items-center`}
        >
          {isUploading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isUploading ? 'Saving...' : experienceEntries.length > 0 ? 'Save Experience' : 'Skip Experience'}
        </button>
      </div>
    </form>
  );
}
