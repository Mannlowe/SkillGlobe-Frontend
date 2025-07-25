'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DragAndDropProps {
  onFileDrop: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSize?: number; // in bytes
  className?: string;
  children?: React.ReactNode;
  showPreview?: boolean;
  disabled?: boolean;
}

export default function DragAndDrop({
  onFileDrop,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  children,
  showPreview = true,
  disabled = false
}: DragAndDropProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    
    setDragCounter(prev => prev - 1);
    if (dragCounter === 1) {
      setIsDragging(false);
    }
  }, [disabled, dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      alert(`File ${file.name} is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
      return false;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.match(type.replace('*', '.*'));
    });

    if (!isValidType) {
      alert(`File ${file.name} is not a supported type. Accepted types: ${acceptedTypes.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    setIsDragging(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(validateFile);
    
    if (validFiles.length > maxFiles) {
      alert(`Too many files. Maximum ${maxFiles} files allowed.`);
      return;
    }

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      onFileDrop(validFiles);
    }
  }, [disabled, maxFiles, onFileDrop, validateFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(validateFile);
    
    if (validFiles.length > maxFiles) {
      alert(`Too many files. Maximum ${maxFiles} files allowed.`);
      return;
    }

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      onFileDrop(validFiles);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [disabled, maxFiles, onFileDrop, validateFile]);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const openFileDialog = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          isDragging 
            ? "border-orange-500 bg-orange-50" 
            : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        {children || (
          <>
            <Upload className={cn(
              "w-12 h-12 mx-auto mb-4",
              isDragging ? "text-orange-500" : "text-gray-400"
            )} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isDragging ? 'Drop files here' : 'Upload files'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <div className="text-sm text-gray-500">
              <p>Supported formats: {acceptedTypes.join(', ')}</p>
              <p>Maximum {maxFiles} files, {Math.round(maxSize / 1024 / 1024)}MB each</p>
            </div>
          </>
        )}

        {isDragging && (
          <div className="absolute inset-0 bg-orange-500 bg-opacity-10 rounded-lg flex items-center justify-center">
            <div className="text-orange-600 font-medium">Drop files here</div>
          </div>
        )}
      </div>

      {/* File Preview */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-gray-900">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized drag and drop for different use cases

interface ImageDropZoneProps {
  onImageDrop: (files: File[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageDropZone({ onImageDrop, maxImages = 5, className }: ImageDropZoneProps) {
  return (
    <DragAndDrop
      onFileDrop={onImageDrop}
      acceptedTypes={['image/*']}
      maxFiles={maxImages}
      maxSize={5 * 1024 * 1024} // 5MB
      className={className}
    >
      <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Images</h3>
      <p className="text-gray-600 mb-4">
        Drag and drop images here, or click to browse
      </p>
      <div className="text-sm text-gray-500">
        <p>Supported formats: JPG, PNG, GIF, WebP</p>
        <p>Maximum {maxImages} images, 5MB each</p>
      </div>
    </DragAndDrop>
  );
}

interface DocumentDropZoneProps {
  onDocumentDrop: (files: File[]) => void;
  maxDocuments?: number;
  className?: string;
}

export function DocumentDropZone({ onDocumentDrop, maxDocuments = 3, className }: DocumentDropZoneProps) {
  return (
    <DragAndDrop
      onFileDrop={onDocumentDrop}
      acceptedTypes={['application/pdf', '.doc', '.docx', '.txt']}
      maxFiles={maxDocuments}
      maxSize={10 * 1024 * 1024} // 10MB
      className={className}
    >
      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Documents</h3>
      <p className="text-gray-600 mb-4">
        Drag and drop documents here, or click to browse
      </p>
      <div className="text-sm text-gray-500">
        <p>Supported formats: PDF, DOC, DOCX, TXT</p>
        <p>Maximum {maxDocuments} documents, 10MB each</p>
      </div>
    </DragAndDrop>
  );
}