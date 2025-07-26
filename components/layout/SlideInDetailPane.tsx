'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, DollarSign, Calendar, Star, Bookmark, Send, MessageCircle, ExternalLink, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  postedDate: Date;
  matchScore: number;
  requirements: {
    skill: string;
    level: 'required' | 'preferred' | 'nice-to-have';
    userHas?: boolean;
    userLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }[];
  description: string;
  highlights: string[];
  applicationStatus: 'not-applied' | 'applied' | 'interview' | 'rejected' | 'offered';
  aiInsights?: {
    summary: string;
    strengths: string[];
    improvements: string[];
  };
}

interface SlideInDetailPaneProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
  onApply: (opportunityId: string, type: 'quick' | 'custom') => void;
  onSave: (opportunityId: string) => void;
  onAskAI: (opportunityId: string, question: string) => void;
  isMobile?: boolean;
}

export default function SlideInDetailPane({
  isOpen,
  onClose,
  opportunity,
  onApply,
  onSave,
  onAskAI,
  isMobile = false
}: SlideInDetailPaneProps) {
  const [customMessage, setCustomMessage] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [showCustomApplication, setShowCustomApplication] = useState(false);

  // Handle ESC key to close the pane
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    // Add event listener with high priority (capture phase)
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !opportunity) return null;

  const formatSalary = (min: number, max: number, currency: string) => {
    return `${currency}${min}k - ${currency}${max}k`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const getRequirementIcon = (requirement: Opportunity['requirements'][0]) => {
    if (requirement.userHas) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (requirement.level === 'required') {
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  const getRequirementColor = (requirement: Opportunity['requirements'][0]) => {
    if (requirement.userHas) return 'text-green-700 bg-green-50 border-green-200';
    if (requirement.level === 'required') return 'text-red-700 bg-red-50 border-red-200';
    if (requirement.level === 'preferred') return 'text-orange-700 bg-orange-50 border-orange-200';
    return 'text-gray-700 bg-gray-50 border-gray-200';
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-purple-100 text-purple-700';
      case 'advanced': return 'bg-blue-100 text-blue-700';
      case 'intermediate': return 'bg-green-100 text-green-700';
      case 'beginner': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: Opportunity['applicationStatus']) => {
    switch (status) {
      case 'not-applied': return 'bg-gray-100 text-gray-700';
      case 'applied': return 'bg-blue-100 text-blue-700';
      case 'interview': return 'bg-orange-100 text-orange-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'offered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleQuickApply = () => {
    onApply(opportunity.id, 'quick');
  };

  const handleCustomApply = () => {
    if (customMessage.trim()) {
      onApply(opportunity.id, 'custom');
      setCustomMessage('');
      setShowCustomApplication(false);
    }
  };

  const handleAskAI = () => {
    if (aiQuestion.trim()) {
      onAskAI(opportunity.id, aiQuestion);
      setAiQuestion('');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Detail Pane */}
      <div className={cn(
        "fixed right-0 top-16 bottom-0 bg-white border-l border-gray-200 z-50 transition-transform duration-300 overflow-hidden",
        isMobile ? "w-full" : "w-[600px] lg:w-[700px]",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{opportunity.title}</h2>
                  <Badge className={cn("text-xs", getStatusColor(opportunity.applicationStatus))}>
                    {opportunity.applicationStatus.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span className="font-medium">{opportunity.company}</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatSalary(opportunity.salary.min, opportunity.salary.max, opportunity.salary.currency)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">{opportunity.matchScore}% match</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Posted {formatTimeAgo(opportunity.postedDate)}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* AI Insights */}
              {opportunity.aiInsights && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-blue-600" />
                    AI Insights
                  </h3>
                  <p className="text-sm text-gray-700 mb-3">{opportunity.aiInsights.summary}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <h4 className="font-medium text-green-700 mb-1">Your Strengths</h4>
                      <ul className="space-y-1">
                        {opportunity.aiInsights.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span className="text-gray-600">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-700 mb-1">Areas to Improve</h4>
                      <ul className="space-y-1">
                        {opportunity.aiInsights.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3 text-orange-600" />
                            <span className="text-gray-600">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
                <div className="space-y-2">
                  {opportunity.requirements.map((requirement, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border",
                        getRequirementColor(requirement)
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        {getRequirementIcon(requirement)}
                        <div>
                          <span className="font-medium">{requirement.skill}</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {requirement.level}
                            </Badge>
                            {requirement.userHas && requirement.userLevel && (
                              <Badge className={cn("text-xs", getLevelBadgeColor(requirement.userLevel))}>
                                Your level: {requirement.userLevel}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Job Description</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{opportunity.description}</p>
              </div>

              {/* Highlights */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Job Highlights</h3>
                <div className="space-y-2">
                  {opportunity.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ask AI */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask AI about this role
                </h3>
                <div className="space-y-3">
                  <Textarea
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="e.g., What skills should I focus on? How can I improve my application?"
                    className="resize-none"
                    rows={2}
                  />
                  <Button
                    onClick={handleAskAI}
                    disabled={!aiQuestion.trim()}
                    size="sm"
                    className="w-full"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask AI
                  </Button>
                </div>
              </div>

              {/* Custom Application */}
              {showCustomApplication && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Custom Application</h3>
                  <div className="space-y-3">
                    <Textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Write a personalized message to the employer..."
                      className="resize-none"
                      rows={4}
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleCustomApply}
                        disabled={!customMessage.trim()}
                        className="flex-1"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Application
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCustomApplication(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex-shrink-0 p-6 border-t border-gray-200">
            <div className="flex space-x-3">
              {opportunity.applicationStatus === 'not-applied' ? (
                <>
                  <Button onClick={handleQuickApply} className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Quick Apply
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCustomApplication(!showCustomApplication)}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Custom Apply
                  </Button>
                </>
              ) : (
                <Button variant="outline" className="flex-1" disabled>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Applied
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => onSave(opportunity.id)}
                size="icon"
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}