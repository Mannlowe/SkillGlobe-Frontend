'use client';

import React, { useState, useEffect } from 'react';
import { Award, Upload, Plus, Pencil, Trash2, GripVertical, Check } from 'lucide-react';
import { addCertificate, getAuthData, getCertificateList } from '@/app/api/portfolio/addCertificate';
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
  isUploading?: boolean;
  isUploaded?: boolean;
  uploadError?: string;
}

interface CertificateFormProps {
  onSave?: (data: CertificateEntry[]) => void;
  onCancel?: () => void;
  initialData?: CertificateEntry[];
  setCertificateList?: (data: any[]) => void; // <-- New prop
}


export default function CertificateForm({ onSave, onCancel, initialData = [], setCertificateList }: CertificateFormProps) {
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
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [apiCertificates, setApiCertificates] = useState<any[]>([]);

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
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const filteredCertificateEntries = certificateEntries.filter(
    (entry) => (entry.certificateName ? entry.certificateName.trim() !== '' : false) || entry.certificateFile !== null
  );

  // Fetch certificate list on component mount
  useEffect(() => {
    const fetchCertificateList = async () => {
      const authData = getAuthData();
      if (!authData) return;

      try {
        const response = await getCertificateList(authData.entityId, authData.apiKey, authData.apiSecret);
        const updatedList = response.message?.data?.certificate_list || [];
        setApiCertificates(updatedList);
        setCertificateList?.(updatedList);
        console.log('Fetched certificate list:', updatedList);
      } catch (error) {
        console.error('Error fetching certificate list:', error);
      }
    };

    fetchCertificateList();
  }, [setCertificateList]);

  // // Update certificate list when a certificate is uploaded
  // useEffect(() => {
  //   const fetchUpdatedList = async () => {
  //     const activeEntry = certificateEntries.find(e => e.id === activeEntryId);
  //     if (activeEntry?.isUploaded) {
  //       const authData = getAuthData();
  //       if (!authData) return;
  
  //       const response = await getCertificateList(authData.entityId, authData.apiKey, authData.apiSecret);
  //       const updatedList = response.message?.data?.certificate_list || [];
  //       setApiCertificates(updatedList);
  //       setCertificateList?.(updatedList);
  //       console.log('Updated certificate list after upload:', updatedList);
  //     }
  //   };
  
  //   fetchUpdatedList();
  // }, [activeEntryId, certificateEntries, setCertificateList]);
  

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
          const newErrors = { ...prev };
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
    if (!activeEntry) {
      console.log('No active entry found');
      return false;
    }

    const errors: { [key: string]: string } = {};

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
    const isValid = Object.keys(errors).length === 0;
    console.log('Validation result:', isValid, 'Errors:', errors);
    return isValid;
  };

  const saveActiveEntry = async () => {
    console.log('saveActiveEntry called');
    if (validateActiveEntry()) {
      const activeEntry = certificateEntries.find(entry => entry.id === activeEntryId);
      if (!activeEntry || !activeEntry.certificateFile) return;

      // Get auth data
      const authData = getAuthData();
      console.log('Auth data:', authData);
      if (!authData) {
        console.error('Authentication data not found');
        setCertificateEntries(prev =>
          prev.map(entry =>
            entry.id === activeEntryId ? { ...entry, uploadError: 'Authentication failed' } : entry
          )
        );
        return;
      }

      try {
        // Mark as uploading
        setCertificateEntries(prev =>
          prev.map(entry =>
            entry.id === activeEntryId ? { ...entry, isUploading: true, uploadError: undefined } : entry
          )
        );

        // Prepare certificate data
        const certificateData = {
          entity_id: authData.entityId,
          document_name: activeEntry.certificateName,
          certificate_type: 'Technical', // Default to Technical as shown in the image
          document_upload: activeEntry.certificateFile,
          issuing_organisation: '' // Optional, can be left empty
        };

        console.log('Certificate data prepared:', {
          ...certificateData,
          document_upload: 'File object present' // Don't log the actual file
        });

        // Call API
        console.log('Calling addCertificate API...');
        try {
          const response = await addCertificate(certificateData, authData.apiKey, authData.apiSecret);
          console.log('API call successful:', response);
        } catch (error) {
          console.error('API call failed:', error);
          throw error;
        }

        // Update entry status
        setCertificateEntries(prev =>
          prev.map(entry =>
            entry.id === activeEntryId ? {
              ...entry,
              isUploading: false,
              isUploaded: true
            } : entry
          )
        );

        // Exit edit mode after successful upload
        setEditMode(false);
      } catch (error: any) {
        console.error('Error uploading certificate:', error);
        setCertificateEntries(prev =>
          prev.map(entry =>
            entry.id === activeEntryId ? {
              ...entry,
              isUploading: false,
              uploadError: error.message || 'Failed to upload certificate'
            } : entry
          )
        );
      }
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
      // Check if we're reordering API certificates
      if (active.id.toString().startsWith('api-')) {
        setApiCertificates((items) => {
          const oldIndex = parseInt(active.id.toString().replace('api-', ''));
          const newIndex = parseInt(over.id.toString().replace('api-', ''));
          return arrayMove(items, oldIndex, newIndex);
        });
      } else {
        // Original logic for local certificate entries
        setCertificateEntries((items) => {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  };
  
  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Functions to handle API certificate edit and delete
  const editApiCertificate = (cert: any) => {
    // Here you would implement edit functionality for API certificates
    console.log('Edit certificate:', cert);
    // You could open a modal or set some state to edit this certificate
  };

  const deleteApiCertificate = (cert: any) => {
    // Here you would implement delete functionality for API certificates
    console.log('Delete certificate:', cert);
    // You could show a confirmation dialog and then delete the certificate
    if (confirm(`Are you sure you want to delete certificate: ${cert.document_name}?`)) {
      // Remove from API certificates list
      setApiCertificates(prev => prev.filter(c => c.id !== cert.id));
    }
  };

  // Sortable API certificate item component
  interface SortableApiCertificateItemProps {
    id: string;
    cert: any;
  }

  const SortableApiCertificateItem = ({ id, cert }: SortableApiCertificateItemProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id });

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
            <h4 className="font-medium text-gray-900">{cert.document_name || 'Untitled Certificate'}</h4>
            <p className="text-sm text-gray-600">{cert.document_upload || 'No file information'}</p>
          </div>
          <div className="flex space-x-3 ml-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => editApiCertificate(cert)}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Edit certificate"
            >
              <Pencil size={18} />
            </button>
            <button
              type="button"
              onClick={() => deleteApiCertificate(cert)}
              className="text-red-600 hover:text-red-800"
              aria-label="Remove certificate"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
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
        {!editMode && (
          <div className="mb-6">
            {/* API Certificates with DndContext */}
            {apiCertificates.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Your Certificates</h4>
                {/* @ts-ignore - Ignoring type error with DndContext */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  {/* @ts-ignore - Ignoring type error with SortableContext */}
                  <SortableContext
                    items={apiCertificates.map((cert, index) => `api-${index}`)}
                    strategy={verticalStrategy}
                  >
                    {apiCertificates.map((cert, index) => (
                      <SortableApiCertificateItem 
                        key={index}
                        id={`api-${index}`}
                        cert={cert}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            )}
            
            {apiCertificates.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Award className="mx-auto mb-2 opacity-30" size={32} />
                <p>No certificates added yet</p>
              </div>
            )}
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
                    onClick={async () => {
                      setEditMode(false);

                      // Get auth data
                      const authData = getAuthData();
                      if (!authData) {
                        console.error('Auth data missing');
                        return;
                      }

                      // Call API to fetch updated list
                      try {
                        const response = await getCertificateList(authData.entityId, authData.apiKey, authData.apiSecret);
                        const updatedList = response.message?.data?.certificate_list || [];

                        // Update list in parent component
                        if (setCertificateList) {
                          setCertificateList(updatedList);
                        }
                      } catch (err) {
                        console.error('Failed to fetch certificate list:', err);
                      }
                    }}
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
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${validationErrors.certificateName ? 'border-red-500' : 'border-gray-300'
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
                        Upload Certificate <span className="text-red-500">*</span>
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
            disabled={certificateEntries.find(e => e.id === activeEntryId)?.isUploading}
            className={`px-4 py-2 border rounded-lg flex items-center ${certificateEntries.find(e => e.id === activeEntryId)?.isUploaded
              ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
          >
            {certificateEntries.find(e => e.id === activeEntryId)?.isUploading ? (
              <>
                <span className="animate-pulse mr-2">Uploading...</span>
              </>
            ) : certificateEntries.find(e => e.id === activeEntryId)?.isUploaded ? (
              <>
                <Check size={16} className="mr-1" /> Added
              </>
            ) : (
              certificateEntries.find(e => e.id === activeEntryId)?.certificateFile ? 'Add' : 'Add'
            )}
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
