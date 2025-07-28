'use client';

import React, { useState } from 'react';
import { Award, Upload, Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
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

interface CertificateEntry {
  id: string;
  certificateName: string;
  certificateFile: File | null;
  certificateFileName?: string;
}

interface CertificateFormProps {
  onSave?: (data: CertificateEntry[]) => void;
  onCancel?: () => void;
  initialData?: CertificateEntry[];
}

export default function CertificateForm({ onSave, onCancel, initialData = [] }: CertificateFormProps) {
  const [certificateEntries, setCertificateEntries] = useState<CertificateEntry[]>(
    initialData.length > 0 ? initialData : [
      {
        id: crypto.randomUUID(),
        certificateName: '',
        certificateFile: null,
      }
    ]
  );
  
  const [activeEntryId, setActiveEntryId] = useState<string>(certificateEntries[0]?.id || '');
  const [editMode, setEditMode] = useState<boolean>(true);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, entryId: string) => {
    const { name, value } = e.target;
    setCertificateEntries(prev => 
      prev.map(entry => 
        entry.id === entryId ? { ...entry, [name]: value } : entry
      )
    );
    
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, entryId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateEntries(prev => 
        prev.map(entry => 
          entry.id === entryId ? { 
            ...entry, 
            certificateFile: file,
            certificateFileName: file.name
          } : entry
        )
      );
      
      // Clear validation error for certificate file when user uploads
      if (validationErrors.certificateFile) {
        setValidationErrors(prev => {
          const newErrors = {...prev};
          delete newErrors.certificateFile;
          return newErrors;
        });
      }
    }
  };
  
  const addNewCertificate = () => {
    const newEntry: CertificateEntry = {
      id: crypto.randomUUID(),
      certificateName: '',
      certificateFile: null,
    };
    
    setCertificateEntries(prev => [newEntry, ...prev]);
    setActiveEntryId(newEntry.id);
    setEditMode(true);
  };
  
  const removeCertificate = (entryId: string) => {
    setCertificateEntries(prev => prev.filter(entry => entry.id !== entryId));
    
    // If we removed the active entry, set the first remaining entry as active
    if (activeEntryId === entryId) {
      const remainingEntries = certificateEntries.filter(entry => entry.id !== entryId);
      if (remainingEntries.length > 0) {
        setActiveEntryId(remainingEntries[0].id);
      } else {
        // If no entries left, add a new empty one
        addNewCertificate();
      }
    }
  };
  
  const editCertificate = (entryId: string) => {
    setActiveEntryId(entryId);
    setEditMode(true);
    setValidationErrors({});
  };
  
  const validateActiveEntry = () => {
    const activeEntry = certificateEntries.find(entry => entry.id === activeEntryId);
    if (!activeEntry) return false;
    
    const errors: {[key: string]: string} = {};
    
    // Check required fields
    if (!activeEntry.certificateName) {
      errors.certificateName = 'Certificate name is required';
    }
    
    if (!activeEntry.certificateFile) {
      errors.certificateFile = 'Certificate file is required';
    }
    
    // Set validation errors
    setValidationErrors(errors);
    
    // Return true if no errors
    return Object.keys(errors).length === 0;
  };
  
  const saveActiveEntry = () => {
    if (validateActiveEntry()) {
      setEditMode(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(certificateEntries);
    }
  };
  
  // Handle drag end event for reordering certificate entries
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    if (active.id !== over.id) {
      setCertificateEntries((items) => {
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
  
  // Sortable certificate item component
  const SortableCertificateItem = ({ entry, onEdit, onRemove }: { 
    entry: CertificateEntry; 
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
            <h4 className="font-medium text-gray-900">{entry.certificateName || 'Untitled Certificate'}</h4>
            <p className="text-sm text-gray-600">
              {entry.certificateFileName ? `File: ${entry.certificateFileName}` : 'No file uploaded'}
            </p>
          </div>
          <div className="flex space-x-3 ml-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => onEdit(entry.id)}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Edit certificate entry"
            >
              <Pencil size={18} />
            </button>
            <button
              type="button"
              onClick={() => onRemove(entry.id)}
              className="text-red-600 hover:text-red-800"
              aria-label="Remove certificate entry"
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
          <h3 className="font-semibold text-gray-900">Certificate Information</h3>
          <button
            type="button"
            onClick={addNewCertificate}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus size={16} className="mr-1" /> Add Certificate
          </button>
        </div>
        
        {/* Certificate entries list */}
        {!editMode && certificateEntries.length > 0 && (
          <div className="mb-6">
            {/* @ts-ignore - Ignoring type error with DndContext */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              {/* @ts-ignore - Ignoring type error with SortableContext */}
              <SortableContext
                items={certificateEntries.map(entry => entry.id)}
                strategy={verticalStrategy}
              >
                {certificateEntries.map((entry) => (
                  <SortableCertificateItem 
                    key={entry.id} 
                    entry={entry} 
                    onEdit={editCertificate} 
                    onRemove={removeCertificate} 
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
        
        {/* Certificate form */}
        {editMode && activeEntryId && (
          <div>
            {certificateEntries.length > 0 && (
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <h4 className="font-medium text-gray-900">
                  {certificateEntries.find(e => e.id === activeEntryId)?.certificateName || 'New Certificate'}
                </h4>
                {certificateEntries.length > 0 && (
                  <button 
                    type="button" 
                    onClick={() => setEditMode(false)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Back to List
                  </button>
                )}
              </div>
            )}
            
            <div className="space-y-4">
              {certificateEntries.map(entry => (
                entry.id === activeEntryId && (
                  <React.Fragment key={entry.id}>
                    {/* Certificate Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Certificate Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        {/* <Award className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} /> */}
                        <input
                          type="text"
                          name="certificateName"
                          value={entry.certificateName}
                          onChange={(e) => handleInputChange(e, entry.id)}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            validationErrors.certificateName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Certificate name"
                          required
                        />
                        {validationErrors.certificateName && (
                          <p className="text-xs text-red-500 mt-1">{validationErrors.certificateName}</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Certificate Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Certificate
                      </label>
                      <div className="relative">
                        {!entry.certificateFile ? (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                            <Upload className="mx-auto text-gray-400 mb-2" size={20} />
                            <p className="text-sm font-medium text-gray-900">Upload Certificate</p>
                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 5MB)</p>
                            {validationErrors.certificateFile && (
                              <p className="text-xs text-red-500 mt-1">{validationErrors.certificateFile}</p>
                            )}
                            <input
                              type="file"
                              name="certificateFile"
                              onChange={(e) => handleFileChange(e, entry.id)}
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        ) : (
                          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Award className="text-blue-600" size={16} />
                                <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                  {entry.certificateFileName}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setCertificateEntries(prev => 
                                    prev.map(e => 
                                      e.id === entry.id ? { ...e, certificateFile: null, certificateFileName: undefined } : e
                                    )
                                  );
                                }}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
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
            onClick={saveActiveEntry}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {certificateEntries.find(e => e.id === activeEntryId)?.certificateFile ? 'Save' : 'Add'}
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          {certificateEntries.length > 0 ? 'Save Certificates' : 'Skip Certificates'}
        </button>
      </div>
    </form>
  );
}
