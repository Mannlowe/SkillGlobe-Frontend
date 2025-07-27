'use client';

import React from 'react';
import { Plus, FileCheck, CheckCircle, Calendar, Building2, ExternalLink } from 'lucide-react';
import { VerifiedCertificationsDisplay } from '@/types/verification';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VerifiedCertificationsSectionProps {
  certificationsData: VerifiedCertificationsDisplay;
  onAddCertification?: () => void;
  onVerifyCertification?: (id: string) => void;
}

export default function VerifiedCertificationsSection({
  certificationsData,
  onAddCertification,
  onVerifyCertification
}: VerifiedCertificationsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            Certifications
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Professional certifications enhance your credibility
          </p>
        </div>
        
        {onAddCertification && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddCertification}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Certification
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {certificationsData.certifications.map((cert) => (
          <div
            key={cert.id}
            className={cn(
              'p-4 rounded-lg border transition-all',
              cert.verified 
                ? 'border-gold-200 bg-gradient-to-r from-yellow-50 to-amber-50' 
                : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  {cert.verified && (
                    <div className="flex items-center gap-1 text-yellow-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {cert.issuer}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Issued {new Date(cert.issueDate).toLocaleDateString()}
                  </div>
                  {cert.expiryDate && (
                    <div className="text-orange-600">
                      Expires {new Date(cert.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {cert.verified && cert.verificationUrl && (
                  <a 
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-2"
                  >
                    View credential <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {!cert.verified && onVerifyCertification && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onVerifyCertification(cert.id)}
                  className="text-yellow-700 hover:text-yellow-800"
                >
                  Verify
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}