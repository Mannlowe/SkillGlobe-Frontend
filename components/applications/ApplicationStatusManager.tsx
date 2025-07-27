'use client';

import React, { useState } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  FileText,
  Phone,
  Video,
  Award,
  Edit3,
  Save,
  X,
  Plus,
  MessageSquare
} from 'lucide-react';
import { 
  JobApplication, 
  ApplicationStatus, 
  ApplicationStatusChange,
  Interview 
} from '@/types/application-tracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ApplicationStatusManagerProps {
  application: JobApplication;
  onStatusUpdate: (applicationId: string, newStatus: ApplicationStatus, notes?: string) => void;
  onInterviewSchedule: (applicationId: string, interview: Partial<Interview>) => void;
  onNoteAdd: (applicationId: string, note: string) => void;
}

export default function ApplicationStatusManager({
  application,
  onStatusUpdate,
  onInterviewSchedule,
  onNoteAdd
}: ApplicationStatusManagerProps) {
  const { toast } = useToast();
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>(application.status);
  const [statusNotes, setStatusNotes] = useState('');
  const [isSchedulingInterview, setIsSchedulingInterview] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    type: 'phone' as Interview['type'],
    scheduledDate: new Date(),
    duration: 30,
    interviewer: '',
    notes: ''
  });
  const [newNote, setNewNote] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);

  // Status progression mapping
  const statusFlow: Record<ApplicationStatus, ApplicationStatus[]> = {
    'draft': ['submitted'],
    'submitted': ['under_review', 'rejected', 'withdrawn'],
    'under_review': ['phone_screening', 'rejected', 'withdrawn'],
    'phone_screening': ['technical_interview', 'rejected', 'withdrawn'],
    'technical_interview': ['final_interview', 'rejected', 'withdrawn'],
    'final_interview': ['offer_received', 'rejected', 'withdrawn'],
    'offer_received': ['offer_accepted', 'offer_declined'],
    'offer_accepted': [],
    'offer_declined': [],
    'rejected': [],
    'withdrawn': []
  };

  // Status display configuration
  const statusConfig: Record<ApplicationStatus, { 
    label: string; 
    icon: React.ComponentType<any>; 
    color: string;
    bgColor: string;
  }> = {
    'draft': { label: 'Draft', icon: Edit3, color: 'text-gray-600', bgColor: 'bg-gray-100' },
    'submitted': { label: 'Submitted', icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    'under_review': { label: 'Under Review', icon: AlertCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    'phone_screening': { label: 'Phone Screening', icon: Phone, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    'technical_interview': { label: 'Technical Interview', icon: Video, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    'final_interview': { label: 'Final Interview', icon: Video, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    'offer_received': { label: 'Offer Received', icon: Award, color: 'text-green-600', bgColor: 'bg-green-100' },
    'offer_accepted': { label: 'Offer Accepted', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
    'offer_declined': { label: 'Offer Declined', icon: XCircle, color: 'text-gray-600', bgColor: 'bg-gray-100' },
    'rejected': { label: 'Rejected', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
    'withdrawn': { label: 'Withdrawn', icon: XCircle, color: 'text-gray-600', bgColor: 'bg-gray-100' }
  };

  const handleStatusUpdate = () => {
    onStatusUpdate(application.id, newStatus, statusNotes);
    setIsEditingStatus(false);
    setStatusNotes('');
    toast({
      title: 'Status Updated',
      description: `Application status changed to ${statusConfig[newStatus].label}`,
    });
  };

  const handleInterviewSchedule = () => {
    const interview: Partial<Interview> = {
      ...interviewForm,
      scheduledDate: interviewForm.scheduledDate.toISOString(),
      status: 'scheduled'
    };
    
    onInterviewSchedule(application.id, interview);
    setIsSchedulingInterview(false);
    setInterviewForm({
      type: 'phone',
      scheduledDate: new Date(),
      duration: 30,
      interviewer: '',
      notes: ''
    });
    
    toast({
      title: 'Interview Scheduled',
      description: `${interviewForm.type} interview scheduled successfully`,
    });
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      onNoteAdd(application.id, newNote.trim());
      setNewNote('');
      setShowAddNote(false);
      toast({
        title: 'Note Added',
        description: 'Your note has been added to the application',
      });
    }
  };

  const getNextPossibleStatuses = () => {
    return statusFlow[application.status] || [];
  };

  const CurrentStatusDisplay = () => {
    const config = statusConfig[application.status];
    const Icon = config.icon;
    
    return (
      <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", config.bgColor)}>
        <Icon className={cn("w-5 h-5", config.color)} />
        <span className={cn("font-medium", config.color)}>{config.label}</span>
      </div>
    );
  };

  const StatusTimeline = () => (
    <div className="space-y-3">
      <h4 className="font-medium">Status History</h4>
      <div className="space-y-2">
        {application.statusHistory.map((status, index) => {
          const config = statusConfig[status.status];
          const Icon = config.icon;
          const isLatest = index === application.statusHistory.length - 1;
          
          return (
            <div key={status.id} className={cn(
              "flex items-start gap-3 p-3 rounded-lg border",
              isLatest ? "border-blue-200 bg-blue-50" : "border-gray-200"
            )}>
              <div className={cn("p-1 rounded-full", config.bgColor)}>
                <Icon className={cn("w-4 h-4", config.color)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{config.label}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(status.changedDate).toLocaleDateString()}
                  </span>
                </div>
                {status.notes && (
                  <p className="text-sm text-gray-600 mt-1">{status.notes}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const QuickActions = () => {
    const nextStatuses = getNextPossibleStatuses();
    
    return (
      <div className="space-y-3">
        <h4 className="font-medium">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          {nextStatuses.map(status => {
            const config = statusConfig[status];
            const Icon = config.icon;
            
            return (
              <Button
                key={status}
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewStatus(status);
                  setIsEditingStatus(true);
                }}
                className="justify-start gap-2"
              >
                <Icon className="w-4 h-4" />
                Move to {config.label}
              </Button>
            );
          })}
          
          {['phone_screening', 'technical_interview', 'final_interview'].includes(application.status) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSchedulingInterview(true)}
              className="justify-start gap-2"
            >
              <Calendar className="w-4 h-4" />
              Schedule Interview
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddNote(true)}
            className="justify-start gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Add Note
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Status
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingStatus(true)}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CurrentStatusDisplay />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-6">
          <QuickActions />
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card>
        <CardContent className="pt-6">
          <StatusTimeline />
        </CardContent>
      </Card>

      {/* Application Notes */}
      {application.notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {application.notes.map((note, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                  {note}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Status Dialog */}
      <Dialog open={isEditingStatus} onOpenChange={setIsEditingStatus}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Change the status of your application and add any relevant notes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ApplicationStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <config.icon className="w-4 h-4" />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this status change..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingStatus(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Dialog */}
      <Dialog open={isSchedulingInterview} onOpenChange={setIsSchedulingInterview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Schedule an interview for this application.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="interview-type">Interview Type</Label>
              <Select
                value={interviewForm.type}
                onValueChange={(value) => setInterviewForm(prev => ({ ...prev, type: value as Interview['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone Interview</SelectItem>
                  <SelectItem value="video">Video Interview</SelectItem>
                  <SelectItem value="onsite">On-site Interview</SelectItem>
                  <SelectItem value="technical">Technical Interview</SelectItem>
                  <SelectItem value="final">Final Interview</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Interview Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !interviewForm.scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {interviewForm.scheduledDate ? (
                      format(interviewForm.scheduledDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={interviewForm.scheduledDate}
                    onSelect={(date) => date && setInterviewForm(prev => ({ ...prev, scheduledDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={interviewForm.duration}
                onChange={(e) => setInterviewForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              />
            </div>
            
            <div>
              <Label htmlFor="interviewer">Interviewer</Label>
              <Input
                id="interviewer"
                placeholder="e.g., John Smith - Engineering Manager"
                value={interviewForm.interviewer}
                onChange={(e) => setInterviewForm(prev => ({ ...prev, interviewer: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="interview-notes">Notes (Optional)</Label>
              <Textarea
                id="interview-notes"
                placeholder="Add any notes about the interview..."
                value={interviewForm.notes}
                onChange={(e) => setInterviewForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSchedulingInterview(false)}>
              Cancel
            </Button>
            <Button onClick={handleInterviewSchedule}>
              Schedule Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showAddNote} onOpenChange={setShowAddNote}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add a note to track important information about this application.
            </DialogDescription>
          </DialogHeader>
          
          <div>
            <Label htmlFor="new-note">Note</Label>
            <Textarea
              id="new-note"
              placeholder="Enter your note here..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddNote(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote}>
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}