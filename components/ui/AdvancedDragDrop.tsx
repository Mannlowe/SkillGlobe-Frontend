'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Upload, 
  File, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  Music, 
  Archive,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  FolderPlus,
  Copy,
  Move
} from 'lucide-react';

interface AdvancedFile extends File {
  id: string;
  progress?: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  thumbnail?: string;
  metadata?: {
    dimensions?: { width: number; height: number };
    duration?: number;
    size: number;
    type: string;
  };
}

interface AdvancedDragDropProps {
  onFilesDrop: (files: AdvancedFile[]) => void;
  onFilesUpload?: (files: AdvancedFile[]) => Promise<void>;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSize?: number;
  maxTotalSize?: number;
  allowMultiple?: boolean;
  allowFolders?: boolean;
  autoUpload?: boolean;
  showPreview?: boolean;
  showMetadata?: boolean;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  validation?: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    aspectRatio?: number;
    allowedFormats?: string[];
  };
  compression?: {
    images?: { quality: number; maxWidth: number; maxHeight: number };
    enabled: boolean;
  };
}

export default function AdvancedDragDrop({
  onFilesDrop,
  onFilesUpload,
  acceptedTypes = ['*/*'],
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  maxTotalSize = 200 * 1024 * 1024, // 200MB
  allowMultiple = true,
  allowFolders = false,
  autoUpload = false,
  showPreview = true,
  showMetadata = true,
  className,
  children,
  disabled = false,
  validation,
  compression
}: AdvancedDragDropProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDepth, setDragDepth] = useState(0);
  const [files, setFiles] = useState<AdvancedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [totalProgress, setTotalProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // File validation
  const validateFile = useCallback(async (file: File): Promise<{ valid: boolean; error?: string }> => {
    // Size validation
    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: `File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB` 
      };
    }

    // Type validation
    if (!acceptedTypes.includes('*/*')) {
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace('*', '.*'));
      });

      if (!isValidType) {
        return { 
          valid: false, 
          error: `File type not supported. Accepted types: ${acceptedTypes.join(', ')}` 
        };
      }
    }

    // Image-specific validation
    if (validation && file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const { width, height } = img;
          
          if (validation.minWidth && width < validation.minWidth) {
            resolve({ valid: false, error: `Image width too small. Minimum: ${validation.minWidth}px` });
            return;
          }
          
          if (validation.minHeight && height < validation.minHeight) {
            resolve({ valid: false, error: `Image height too small. Minimum: ${validation.minHeight}px` });
            return;
          }
          
          if (validation.maxWidth && width > validation.maxWidth) {
            resolve({ valid: false, error: `Image width too large. Maximum: ${validation.maxWidth}px` });
            return;
          }
          
          if (validation.maxHeight && height > validation.maxHeight) {
            resolve({ valid: false, error: `Image height too large. Maximum: ${validation.maxHeight}px` });
            return;
          }
          
          if (validation.aspectRatio) {
            const ratio = width / height;
            const expectedRatio = validation.aspectRatio;
            const tolerance = 0.1;
            
            if (Math.abs(ratio - expectedRatio) > tolerance) {
              resolve({ 
                valid: false, 
                error: `Invalid aspect ratio. Expected: ${expectedRatio.toFixed(2)}` 
              });
              return;
            }
          }
          
          resolve({ valid: true });
        };
        
        img.onerror = () => {
          resolve({ valid: false, error: 'Invalid image file' });
        };
        
        img.src = URL.createObjectURL(file);
      });
    }

    return { valid: true };
  }, [maxSize, acceptedTypes, validation]);

  // Generate file metadata
  const generateMetadata = useCallback(async (file: File): Promise<AdvancedFile['metadata']> => {
    const metadata: AdvancedFile['metadata'] = {
      size: file.size,
      type: file.type
    };

    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            ...metadata,
            dimensions: { width: img.width, height: img.height }
          });
        };
        img.onerror = () => resolve(metadata);
        img.src = URL.createObjectURL(file);
      });
    }

    if (file.type.startsWith('video/')) {
      return new Promise((resolve) => {
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
          resolve({
            ...metadata,
            dimensions: { width: video.videoWidth, height: video.videoHeight },
            duration: video.duration
          });
        };
        video.onerror = () => resolve(metadata);
        video.src = URL.createObjectURL(file);
      });
    }

    return metadata;
  }, []);

  // Generate thumbnail
  const generateThumbnail = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith('image/')) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          const maxSize = 150;
          const ratio = Math.min(maxSize / img.width, maxSize / img.height);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        
        img.onerror = () => reject(new Error('Failed to generate thumbnail'));
        img.src = URL.createObjectURL(file);
      } else {
        reject(new Error('Thumbnail not supported for this file type'));
      }
    });
  }, []);

  // Process files
  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    
    // Check total file count
    if (files.length + filesArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Check total size
    const currentTotalSize = files.reduce((sum, f) => sum + f.size, 0);
    const newTotalSize = filesArray.reduce((sum, f) => sum + f.size, 0);
    
    if (currentTotalSize + newTotalSize > maxTotalSize) {
      alert(`Total size limit exceeded. Maximum ${Math.round(maxTotalSize / 1024 / 1024)}MB allowed`);
      return;
    }

    const processedFiles: AdvancedFile[] = [];

    for (const file of filesArray) {
      const validation = await validateFile(file);
      
      if (!validation.valid) {
        const advancedFile: AdvancedFile = {
          ...file,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'error',
          error: validation.error
        } as AdvancedFile;
        processedFiles.push(advancedFile);
        continue;
      }

      try {
        const metadata = await generateMetadata(file);
        let thumbnail: string | undefined;
        
        try {
          thumbnail = await generateThumbnail(file);
        } catch {
          // Thumbnail generation failed, continue without thumbnail
        }

        const advancedFile: AdvancedFile = {
          ...file,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'pending',
          metadata,
          thumbnail
        } as AdvancedFile;

        processedFiles.push(advancedFile);
      } catch (error) {
        const advancedFile: AdvancedFile = {
          ...file,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'error',
          error: 'Failed to process file'
        } as AdvancedFile;
        processedFiles.push(advancedFile);
      }
    }

    setFiles(prev => [...prev, ...processedFiles]);
    onFilesDrop(processedFiles);

    if (autoUpload && onFilesUpload && processedFiles.some(f => f.status === 'pending')) {
      handleUpload(processedFiles.filter(f => f.status === 'pending'));
    }
  }, [files, maxFiles, maxTotalSize, validateFile, generateMetadata, generateThumbnail, onFilesDrop, autoUpload, onFilesUpload]);

  // Handle upload
  const handleUpload = useCallback(async (filesToUpload?: AdvancedFile[]) => {
    const targetFiles = filesToUpload || files.filter(f => f.status === 'pending');
    if (targetFiles.length === 0) return;

    setIsUploading(true);
    setTotalProgress(0);

    // Update file statuses to uploading
    setFiles(prev => prev.map(file => 
      targetFiles.find(f => f.id === file.id) 
        ? { ...file, status: 'uploading' as const, progress: 0 }
        : file
    ));

    try {
      if (onFilesUpload) {
        await onFilesUpload(targetFiles);
      }

      // Simulate upload progress for demo
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setFiles(prev => prev.map(file => 
          targetFiles.find(f => f.id === file.id)
            ? { ...file, progress: i }
            : file
        ));
        
        setTotalProgress(i);
      }

      // Mark as successful
      setFiles(prev => prev.map(file => 
        targetFiles.find(f => f.id === file.id)
          ? { ...file, status: 'success' as const, progress: 100 }
          : file
      ));

    } catch (error: any) {
      // Mark as failed
      setFiles(prev => prev.map(file => 
        targetFiles.find(f => f.id === file.id)
          ? { ...file, status: 'error' as const, error: error.message || 'Upload failed' }
          : file
      ));
    } finally {
      setIsUploading(false);
      setTotalProgress(0);
    }
  }, [files, onFilesUpload]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    setDragDepth(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    setDragDepth(prev => prev - 1);
    if (dragDepth === 1) {
      setIsDragging(false);
    }
  }, [disabled, dragDepth]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    setIsDragging(false);
    setDragDepth(0);

    const items = Array.from(e.dataTransfer.items);
    const files: File[] = [];

    const processItems = async () => {
      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) files.push(file);
        } else if (allowFolders && item.kind === 'file' && item.webkitGetAsEntry) {
          const entry = item.webkitGetAsEntry();
          if (entry?.isDirectory) {
            // Handle folder processing (simplified)
            console.log('Folder dropped:', entry.name);
          }
        }
      }

      if (files.length > 0) {
        processFiles(files);
      }
    };

    processItems();
  }, [disabled, allowFolders, processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files) return;
    processFiles(e.target.files);
    e.target.value = ''; // Reset input
  }, [disabled, processFiles]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const retryFile = useCallback((id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      handleUpload([{ ...file, status: 'pending' }]);
    }
  }, [files, handleUpload]);

  const getFileIcon = (file: AdvancedFile) => {
    const type = file.type;
    if (type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
    if (type.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (type.startsWith('audio/')) return <Music className="w-5 h-5" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-5 h-5" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300',
          isDragging 
            ? 'border-orange-500 bg-orange-50 scale-105' 
            : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer hover:bg-gray-50'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={allowMultiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
          {...(allowFolders && { webkitdirectory: 'true' } as any)}
        />

        {children || (
          <div className="space-y-4">
            <div className={cn(
              'mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-colors',
              isDragging ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
            )}>
              <Upload className="w-8 h-8" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isDragging ? 'Drop files here' : 'Upload files'}
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop files here, or click to browse
              </p>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p>Supported formats: {acceptedTypes.join(', ')}</p>
              <p>Maximum {maxFiles} files, {formatFileSize(maxSize)} each</p>
              <p>Total size limit: {formatFileSize(maxTotalSize)}</p>
              {allowFolders && <p>Folders are supported</p>}
            </div>
          </div>
        )}

        {isDragging && (
          <div className="absolute inset-0 bg-orange-500 bg-opacity-20 rounded-xl flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <p className="text-orange-600 font-semibold">Drop files here</p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Uploading files...</span>
            <span className="text-sm text-gray-500">{totalProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* File List */}
      {showPreview && files.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Files ({files.length})</h4>
            {!autoUpload && files.some(f => f.status === 'pending') && (
              <button
                onClick={() => handleUpload()}
                disabled={isUploading}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {isUploading ? 'Uploading...' : 'Upload All'}
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                {/* File Icon/Thumbnail */}
                <div className="flex-shrink-0">
                  {file.thumbnail ? (
                    <img 
                      src={file.thumbnail} 
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getFileIcon(file)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                        {showMetadata && file.metadata?.dimensions && (
                          <span> • {file.metadata.dimensions.width}x{file.metadata.dimensions.height}</span>
                        )}
                        {showMetadata && file.metadata?.duration && (
                          <span> • {Math.round(file.metadata.duration)}s</span>
                        )}
                      </p>
                    </div>

                    {/* Status Icon */}
                    <div className="ml-2">
                      {file.status === 'pending' && (
                        <div className="w-5 h-5 rounded-full bg-gray-200" />
                      )}
                      {file.status === 'uploading' && (
                        <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                      )}
                      {file.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {file.status === 'uploading' && file.progress !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {file.status === 'error' && file.error && (
                    <p className="text-xs text-red-600 mt-1">{file.error}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {file.status === 'error' && (
                    <button
                      onClick={() => retryFile(file.id)}
                      className="text-orange-500 hover:text-orange-600 transition-colors"
                      title="Retry upload"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}