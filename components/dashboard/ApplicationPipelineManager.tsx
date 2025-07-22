'use client';

// @ts-nocheck

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Calendar, Clock, Building, DollarSign, FileText, MessageSquare, MoreHorizontal, Plus, Filter } from 'lucide-react';
import type { ApplicationRecord } from '@/types/opportunities';

interface ApplicationPipelineManagerProps {
  applications: ApplicationRecord[];
  onUpdateApplication: (applicationId: string, updates: Partial<ApplicationRecord>) => void;
  onAddNote: (applicationId: string, note: string) => void;
  onScheduleFollowup: (applicationId: string, date: string, type: string) => void;
}

interface PipelineStage {
  id: string;
  title: string;
  color: string;
  bgColor: string;
  applications: ApplicationRecord[];
}

export default function ApplicationPipelineManager({ 
  applications,
  onUpdateApplication,
  onAddNote,
  onScheduleFollowup
}: ApplicationPipelineManagerProps) {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterBy, setFilterBy] = useState<'all' | 'this_week' | 'urgent' | 'high_salary'>('all');

  const stages: PipelineStage[] = [
    {
      id: 'applied',
      title: 'Applied',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      applications: applications.filter(app => app.stage.current === 'applied')
    },
    {
      id: 'phone_screen',
      title: 'Phone Screen',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      applications: applications.filter(app => app.stage.current === 'phone_screen')
    },
    {
      id: 'technical_interview',
      title: 'Technical',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      applications: applications.filter(app => app.stage.current === 'technical_interview')
    },
    {
      id: 'final_interview',
      title: 'Final Interview',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      applications: applications.filter(app => app.stage.current === 'final_interview')
    },
    {
      id: 'offer_negotiation',
      title: 'Offer',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      applications: applications.filter(app => app.stage.current === 'offer_negotiation')
    }
  ];

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Update application stage
    const newStage = destination.droppableId;
    onUpdateApplication(draggableId, {
      stage: {
        ...applications.find(app => app.id === draggableId)?.stage!,
        current: newStage as any
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under_review': return 'bg-blue-100 text-blue-700';
      case 'interview': return 'bg-purple-100 text-purple-700';
      case 'offer': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderApplicationCard = (application: ApplicationRecord, provided: any, snapshot: any) => {
    return (
      <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`
              bg-white rounded-lg border border-gray-200 p-4 mb-3 cursor-pointer
              hover:shadow-md transition-shadow
              ${snapshot.isDragging ? 'shadow-lg rotate-3' : ''}
            `}
            onClick={() => setSelectedApplication(
              selectedApplication === application.id ? null : application.id
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 text-sm leading-tight">
                {application.job_title}
              </h4>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreHorizontal size={14} />
              </button>
            </div>
            
            <div className="flex items-center gap-1 mb-2">
              <Building size={12} className="text-gray-400" />
              <span className="text-xs text-gray-600">{application.company_name}</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status.current)}`}>
                {application.status.current.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-500">
                {getDaysAgo(application.applied_date)}d ago
              </span>
            </div>

            {/* Next Action */}
            {application.next_action && (
              <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                <Clock size={10} />
                <span>{application.next_action}</span>
              </div>
            )}

            {/* Expanded Details */}
            {selectedApplication === application.id && (
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Documents:</span>
                  <span className="text-blue-600">{application.documents.length} files</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Last Update:</span>
                  <span className="text-gray-900">{application.last_update}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Stage:</span>
                  <span className="text-gray-900">{application.stage.current.replace('_', ' ')}</span>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-1 mt-2">
                  <button className="flex-1 text-xs py-1.5 px-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                    <MessageSquare size={10} className="inline mr-1" />
                    Message
                  </button>
                  <button className="flex-1 text-xs py-1.5 px-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-100">
                    <FileText size={10} className="inline mr-1" />
                    Note
                  </button>
                  <button className="flex-1 text-xs py-1.5 px-2 bg-green-50 text-green-600 rounded hover:bg-green-100">
                    <Calendar size={10} className="inline mr-1" />
                    Follow-up
                  </button>
                </div>
              </div>
            )}
          </div>
    );
  };

  function ApplicationCard({ application, index }: { application: ApplicationRecord; index: number }): JSX.Element {
    return (
      <Draggable draggableId={application.id} index={index}>
        {(provided, snapshot) => renderApplicationCard(application, provided, snapshot) as any}
      </Draggable>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Application Pipeline</h2>
          <p className="text-gray-600">Track your applications from start to finish</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              showFilters ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Filter size={16} />
            Filter
          </button>
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Applications</option>
            <option value="this_week">This Week</option>
            <option value="urgent">Needs Action</option>
            <option value="high_salary">High Salary</option>
          </select>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <div key={stage.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{stage.title}</span>
              <div className={`w-3 h-3 rounded-full ${stage.bgColor.replace('bg-', 'bg-')}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stage.applications.length}</p>
            <p className="text-xs text-gray-500">
              {stage.applications.length > 0 && 
                `Avg: ${Math.round(stage.applications.reduce((acc, app) => acc + getDaysAgo(app.applied_date), 0) / stage.applications.length)}d`
              }
            </p>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {(<div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-72">
              <div className={`${stage.bgColor} rounded-t-lg px-4 py-3 border-b border-gray-200`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${stage.color}`}>{stage.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`${stage.color} text-sm font-medium`}>
                      {stage.applications.length}
                    </span>
                    <button className={`${stage.color} hover:opacity-70`}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* @ts-ignore */}
              <Droppable droppableId={stage.id}>
                {/* @ts-ignore */}
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      min-h-96 bg-gray-50 p-4 rounded-b-lg
                      ${snapshot.isDraggingOver ? 'bg-gray-100' : ''}
                    `}
                  >
                    {stage.applications.map((application, index) => (
                      <ApplicationCard 
                        key={application.id}
                        application={application}
                        index={index}
                      />
                    ))}
                    {/* @ts-ignore */}
                    {provided.placeholder as any}
                    
                    {stage.applications.length === 0 && (
                      <div className="text-center text-gray-400 py-8">
                        <Building size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No applications in this stage</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>) as any}
      </DragDropContext>

      {/* Application Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Application Analytics</h3>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>This year</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            <p className="text-sm text-gray-600">Total Applications</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {Math.round((applications.filter(app => app.stage.current !== 'applied').length / applications.length) * 100)}%
            </p>
            <p className="text-sm text-gray-600">Response Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {applications.filter(app => ['technical_interview', 'final_interview'].includes(app.stage.current)).length}
            </p>
            <p className="text-sm text-gray-600">Interviews</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">
              {Math.round(applications.reduce((acc, app) => acc + getDaysAgo(app.applied_date), 0) / applications.length)}
            </p>
            <p className="text-sm text-gray-600">Avg Days Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}