'use client';

import React, { useState, useCallback, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Download,
  FileText,
  Eye,
  Settings,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface BulkWorkflowStep {
  id: string;
  name: string;
  description: string;
  action: (items: string[], options?: any) => Promise<{ success: string[]; failed: string[]; errors?: { [key: string]: string } }>;
  options?: {
    [key: string]: any;
  };
  validation?: (items: string[]) => { valid: boolean; message?: string };
  estimatedDuration?: number; // in seconds
  canSkip?: boolean;
  retryable?: boolean;
}

interface BulkWorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: BulkWorkflowStep[];
  category: 'opportunities' | 'skills' | 'portfolio' | 'messages' | 'general';
  icon: React.ReactNode;
}

interface WorkflowExecution {
  id: string;
  templateId: string;
  items: string[];
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  currentStep: number;
  startTime?: Date;
  endTime?: Date;
  progress: {
    totalSteps: number;
    completedSteps: number;
    currentStepProgress: number;
    overallProgress: number;
  };
  results: {
    [stepId: string]: {
      success: string[];
      failed: string[];
      errors?: { [key: string]: string };
      duration: number;
    };
  };
  logs: Array<{
    timestamp: Date;
    level: 'info' | 'warning' | 'error';
    message: string;
    stepId?: string;
  }>;
}

interface BulkActionWorkflowProps {
  selectedItems: string[];
  templates: BulkWorkflowTemplate[];
  onExecutionStart?: (execution: WorkflowExecution) => void;
  onExecutionComplete?: (execution: WorkflowExecution) => void;
  onExecutionUpdate?: (execution: WorkflowExecution) => void;
  className?: string;
}

// Pre-defined workflow templates
export const defaultWorkflowTemplates: BulkWorkflowTemplate[] = [
  {
    id: 'bulk-apply-opportunities',
    name: 'Bulk Apply to Opportunities',
    description: 'Apply to multiple job opportunities with customized applications',
    category: 'opportunities',
    icon: <Play className="w-4 h-4" />,
    steps: [
      {
        id: 'validate-eligibility',
        name: 'Validate Eligibility',
        description: 'Check if user meets requirements for each opportunity',
        action: async (items) => {
          // Simulate validation
          await new Promise(resolve => setTimeout(resolve, 2000));
          const success = items.filter(() => Math.random() > 0.1);
          const failed = items.filter(id => !success.includes(id));
          return { success, failed };
        },
        estimatedDuration: 30,
        retryable: true
      },
      {
        id: 'customize-applications',
        name: 'Customize Applications',
        description: 'Tailor application content for each opportunity',
        action: async (items) => {
          await new Promise(resolve => setTimeout(resolve, 3000));
          return { success: items, failed: [] };
        },
        estimatedDuration: 60,
        canSkip: true
      },
      {
        id: 'submit-applications',
        name: 'Submit Applications',
        description: 'Submit applications to employers',
        action: async (items) => {
          await new Promise(resolve => setTimeout(resolve, 1500));
          const success = items.filter(() => Math.random() > 0.05);
          const failed = items.filter(id => !success.includes(id));
          return { success, failed };
        },
        estimatedDuration: 45,
        retryable: true
      },
      {
        id: 'schedule-followups',
        name: 'Schedule Follow-ups',
        description: 'Set up automatic follow-up reminders',
        action: async (items) => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { success: items, failed: [] };
        },
        estimatedDuration: 15,
        canSkip: true
      }
    ]
  },
  {
    id: 'bulk-portfolio-optimization',
    name: 'Portfolio Optimization',
    description: 'Optimize multiple portfolio items for better visibility',
    category: 'portfolio',
    icon: <BarChart3 className="w-4 h-4" />,
    steps: [
      {
        id: 'analyze-performance',
        name: 'Analyze Performance',
        description: 'Analyze current performance metrics',
        action: async (items) => {
          await new Promise(resolve => setTimeout(resolve, 2500));
          return { success: items, failed: [] };
        },
        estimatedDuration: 45
      },
      {
        id: 'optimize-content',
        name: 'Optimize Content',
        description: 'Apply SEO and content optimizations',
        action: async (items) => {
          await new Promise(resolve => setTimeout(resolve, 4000));
          return { success: items, failed: [] };
        },
        estimatedDuration: 90
      },
      {
        id: 'update-tags',
        name: 'Update Tags',
        description: 'Update tags and categories for better discoverability',
        action: async (items) => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { success: items, failed: [] };
        },
        estimatedDuration: 20
      }
    ]
  },
  {
    id: 'bulk-skill-verification',
    name: 'Skill Verification',
    description: 'Verify and endorse multiple skills',
    category: 'skills',
    icon: <CheckCircle className="w-4 h-4" />,
    steps: [
      {
        id: 'request-endorsements',
        name: 'Request Endorsements',
        description: 'Send endorsement requests to connections',
        action: async (items) => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return { success: items, failed: [] };
        },
        estimatedDuration: 30
      },
      {
        id: 'schedule-assessments',
        name: 'Schedule Assessments',
        description: 'Schedule skill assessment tests',
        action: async (items) => {
          await new Promise(resolve => setTimeout(resolve, 1500));
          return { success: items, failed: [] };
        },
        estimatedDuration: 25,
        canSkip: true
      },
      {
        id: 'update-skill-levels',
        name: 'Update Skill Levels',
        description: 'Update skill proficiency levels',
        action: async (items) => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { success: items, failed: [] };
        },
        estimatedDuration: 15
      }
    ]
  }
];

export default function BulkActionWorkflow({
  selectedItems,
  templates,
  onExecutionStart,
  onExecutionComplete,
  onExecutionUpdate,
  className
}: BulkActionWorkflowProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [currentExecution, setCurrentExecution] = useState<WorkflowExecution | null>(null);
  const [executionHistory, setExecutionHistory] = useState<WorkflowExecution[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const executionRef = useRef<{ paused: boolean; cancelled: boolean }>({ paused: false, cancelled: false });

  const executeWorkflow = useCallback(async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template || selectedItems.length === 0) return;

    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      templateId,
      items: [...selectedItems],
      status: 'running',
      currentStep: 0,
      startTime: new Date(),
      progress: {
        totalSteps: template.steps.length,
        completedSteps: 0,
        currentStepProgress: 0,
        overallProgress: 0
      },
      results: {},
      logs: [{
        timestamp: new Date(),
        level: 'info',
        message: `Started workflow: ${template.name} with ${selectedItems.length} items`
      }]
    };

    setCurrentExecution(execution);
    executionRef.current = { paused: false, cancelled: false };
    onExecutionStart?.(execution);

    try {
      for (let stepIndex = 0; stepIndex < template.steps.length; stepIndex++) {
        // Check if execution was cancelled
        if (executionRef.current.cancelled) {
          execution.status = 'cancelled';
          execution.logs.push({
            timestamp: new Date(),
            level: 'info',
            message: 'Workflow cancelled by user'
          });
          break;
        }

        // Wait while paused
        while (executionRef.current.paused && !executionRef.current.cancelled) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const step = template.steps[stepIndex];
        execution.currentStep = stepIndex;
        execution.logs.push({
          timestamp: new Date(),
          level: 'info',
          message: `Starting step: ${step.name}`,
          stepId: step.id
        });

        // Update progress
        execution.progress.currentStepProgress = 0;
        execution.progress.overallProgress = (stepIndex / template.steps.length) * 100;
        setCurrentExecution({ ...execution });
        onExecutionUpdate?.(execution);

        try {
          // Validation
          if (step.validation) {
            const validation = step.validation(selectedItems);
            if (!validation.valid) {
              throw new Error(validation.message || 'Validation failed');
            }
          }

          // Execute step
          const stepStartTime = Date.now();
          const result = await step.action(selectedItems, step.options);
          const stepDuration = Date.now() - stepStartTime;

          // Record results
          execution.results[step.id] = {
            ...result,
            duration: stepDuration / 1000
          };

          execution.progress.currentStepProgress = 100;
          execution.progress.completedSteps = stepIndex + 1;
          execution.progress.overallProgress = ((stepIndex + 1) / template.steps.length) * 100;

          if (result.failed.length > 0) {
            execution.logs.push({
              timestamp: new Date(),
              level: 'warning',
              message: `Step completed with ${result.failed.length} failures: ${step.name}`,
              stepId: step.id
            });
          } else {
            execution.logs.push({
              timestamp: new Date(),
              level: 'info',
              message: `Step completed successfully: ${step.name}`,
              stepId: step.id
            });
          }

        } catch (error: any) {
          execution.logs.push({
            timestamp: new Date(),
            level: 'error',
            message: `Step failed: ${step.name} - ${error.message}`,
            stepId: step.id
          });

          if (!step.retryable) {
            execution.status = 'failed';
            break;
          }
        }

        setCurrentExecution({ ...execution });
        onExecutionUpdate?.(execution);
      }

      if (execution.status !== 'cancelled' && execution.status !== 'failed') {
        execution.status = 'completed';
        execution.logs.push({
          timestamp: new Date(),
          level: 'info',
          message: 'Workflow completed successfully'
        });
      }

    } catch (error: any) {
      execution.status = 'failed';
      execution.logs.push({
        timestamp: new Date(),
        level: 'error',
        message: `Workflow failed: ${error.message}`
      });
    } finally {
      execution.endTime = new Date();
      setCurrentExecution({ ...execution });
      setExecutionHistory(prev => [execution, ...prev]);
      onExecutionComplete?.(execution);
    }
  }, [selectedItems, templates, onExecutionStart, onExecutionComplete, onExecutionUpdate]);

  const pauseExecution = useCallback(() => {
    if (currentExecution && currentExecution.status === 'running') {
      executionRef.current.paused = true;
      setCurrentExecution(prev => prev ? { ...prev, status: 'paused' } : null);
    }
  }, [currentExecution]);

  const resumeExecution = useCallback(() => {
    if (currentExecution && currentExecution.status === 'paused') {
      executionRef.current.paused = false;
      setCurrentExecution(prev => prev ? { ...prev, status: 'running' } : null);
    }
  }, [currentExecution]);

  const cancelExecution = useCallback(() => {
    if (currentExecution && (currentExecution.status === 'running' || currentExecution.status === 'paused')) {
      executionRef.current.cancelled = true;
      executionRef.current.paused = false;
    }
  }, [currentExecution]);

  const getStatusIcon = (status: WorkflowExecution['status']) => {
    switch (status) {
      case 'running': return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <Square className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  if (selectedItems.length === 0) {
    return (
      <div className={cn('p-8 text-center text-gray-500', className)}>
        <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Select items to start a bulk workflow</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Current Execution */}
      {currentExecution && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(currentExecution.status)}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {templates.find(t => t.id === currentExecution.templateId)?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentExecution.items.length} items • Step {currentExecution.currentStep + 1} of {currentExecution.progress.totalSteps}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {currentExecution.status === 'running' && (
                <Button onClick={pauseExecution} variant="outline" size="sm">
                  <Pause className="w-4 h-4" />
                </Button>
              )}
              {currentExecution.status === 'paused' && (
                <Button onClick={resumeExecution} variant="outline" size="sm">
                  <Play className="w-4 h-4" />
                </Button>
              )}
              {(currentExecution.status === 'running' || currentExecution.status === 'paused') && (
                <Button onClick={cancelExecution} variant="outline" size="sm">
                  <Square className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Overall Progress</span>
                <span>{Math.round(currentExecution.progress.overallProgress)}%</span>
              </div>
              <Progress value={currentExecution.progress.overallProgress} className="h-2" />
            </div>

            {/* Current Step Progress */}
            {currentExecution.status === 'running' && (
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Current Step</span>
                  <span>{Math.round(currentExecution.progress.currentStepProgress)}%</span>
                </div>
                <Progress value={currentExecution.progress.currentStepProgress} className="h-1" />
              </div>
            )}

            {/* Recent Logs */}
            <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
              <div className="space-y-1 text-xs">
                {currentExecution.logs.slice(-5).map((log, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-gray-500">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                    <span className={cn(
                      log.level === 'error' ? 'text-red-600' :
                      log.level === 'warning' ? 'text-yellow-600' :
                      'text-gray-700'
                    )}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Selection */}
      {!currentExecution && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select Workflow Template
          </h3>
          <p className="text-gray-600 mb-6">
            Choose a workflow template to apply to {selectedItems.length} selected items.
          </p>

          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedTemplate(
                    expandedTemplate === template.id ? null : template.id
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                        {template.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{template.steps.length} steps</Badge>
                      {expandedTemplate === template.id ? 
                        <ChevronDown className="w-5 h-5 text-gray-400" /> :
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      }
                    </div>
                  </div>
                </div>

                {expandedTemplate === template.id && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="space-y-3 mb-4">
                      {template.steps.map((step, index) => (
                        <div key={step.id} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h5 className="font-medium text-gray-900">{step.name}</h5>
                              {step.canSkip && <Badge variant="outline" className="text-xs">Optional</Badge>}
                              {step.retryable && <Badge variant="outline" className="text-xs">Retryable</Badge>}
                            </div>
                            <p className="text-sm text-gray-600">{step.description}</p>
                            {step.estimatedDuration && (
                              <p className="text-xs text-gray-500 mt-1">
                                ~{step.estimatedDuration}s estimated
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => executeWorkflow(template.id)}
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Workflow
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Execution History */}
      {executionHistory.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Execution History</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>

          {showHistory && (
            <div className="space-y-3">
              {executionHistory.slice(0, 5).map((execution) => {
                const template = templates.find(t => t.id === execution.templateId);
                const duration = execution.endTime && execution.startTime ? 
                  execution.endTime.getTime() - execution.startTime.getTime() : 0;

                return (
                  <div key={execution.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(execution.status)}
                      <div>
                        <p className="font-medium text-gray-900">{template?.name}</p>
                        <p className="text-sm text-gray-600">
                          {execution.items.length} items • {execution.startTime?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      {duration > 0 && <span>{formatDuration(duration)}</span>}
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}