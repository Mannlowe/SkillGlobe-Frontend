'use client';

import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  User,
  Star,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Eye,
  Edit,
  MoreHorizontal,
  Download,
  Plus,
  Target,
  Award
} from 'lucide-react';
import { 
  JobApplication, 
  ApplicationStatus, 
  ApplicationFilters,
  ApplicationSearchParams 
} from '@/types/application-tracking';
import { 
  mockApplications, 
  mockApplicationAnalytics,
  getApplicationsByStatus,
  getActiveApplications 
} from '@/lib/mockApplicationData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function ApplicationTracker() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [profileFilter, setProfileFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let filtered = mockApplications;

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.jobTitle.toLowerCase().includes(query) ||
        app.company.toLowerCase().includes(query) ||
        app.profileName.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Profile filter
    if (profileFilter !== 'all') {
      filtered = filtered.filter(app => app.profileId === profileFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.appliedDate);
          bValue = new Date(b.appliedDate);
          break;
        case 'company':
          aValue = a.company;
          bValue = b.company;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'matchScore':
          aValue = a.matchScore;
          bValue = b.matchScore;
          break;
        case 'salary':
          aValue = a.salaryRange[1];
          bValue = b.salaryRange[1];
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchQuery, statusFilter, profileFilter, sortBy, sortOrder]);

  // Get applications by category
  const getApplicationsByCategory = (category: string) => {
    switch (category) {
      case 'active':
        return getActiveApplications();
      case 'offers':
        return getApplicationsByStatus('offer_received');
      case 'rejected':
        return getApplicationsByStatus('rejected');
      case 'interviews':
        return mockApplications.filter(app => 
          ['phone_screening', 'technical_interview', 'final_interview'].includes(app.status)
        );
      default:
        return filteredApplications;
    }
  };

  // Status badge styling
  const getStatusBadge = (status: ApplicationStatus) => {
    const statusConfig = {
      'draft': { label: 'Draft', variant: 'secondary' as const, icon: Edit },
      'submitted': { label: 'Submitted', variant: 'default' as const, icon: Clock },
      'under_review': { label: 'Under Review', variant: 'default' as const, icon: Eye },
      'phone_screening': { label: 'Phone Screen', variant: 'default' as const, icon: Clock },
      'technical_interview': { label: 'Technical Interview', variant: 'default' as const, icon: Clock },
      'final_interview': { label: 'Final Interview', variant: 'default' as const, icon: Clock },
      'offer_received': { label: 'Offer Received', variant: 'default' as const, icon: Award },
      'offer_accepted': { label: 'Offer Accepted', variant: 'default' as const, icon: CheckCircle },
      'offer_declined': { label: 'Offer Declined', variant: 'secondary' as const, icon: XCircle },
      'rejected': { label: 'Rejected', variant: 'destructive' as const, icon: XCircle },
      'withdrawn': { label: 'Withdrawn', variant: 'secondary' as const, icon: XCircle }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  // Application card component
  const ApplicationCard = ({ application }: { application: JobApplication }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{application.jobTitle}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {application.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {application.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(application.appliedDate).toLocaleDateString()}
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(application.status)}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => {
                  setSelectedApplication(application);
                  setShowApplicationDetails(true);
                }}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Update Status
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4 text-gray-500" />
              {application.profileName}
            </span>
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4 text-gray-500" />
              {application.matchScore}% match
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-gray-500" />
              ${(application.salaryRange[0] / 1000).toFixed(0)}k - ${(application.salaryRange[1] / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        {/* Progress indicator for application status */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Application Progress</span>
            <span>{getStatusProgress(application.status)}%</span>
          </div>
          <Progress value={getStatusProgress(application.status)} className="h-2" />
        </div>

        {/* Latest status update */}
        {application.statusHistory.length > 0 && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <strong>Latest:</strong> {application.statusHistory[application.statusHistory.length - 1].notes || 
              `Status changed to ${application.status.replace('_', ' ')}`}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Calculate status progress percentage
  const getStatusProgress = (status: ApplicationStatus): number => {
    const progressMap: Record<ApplicationStatus, number> = {
      'draft': 0,
      'submitted': 10,
      'under_review': 20,
      'phone_screening': 40,
      'technical_interview': 60,
      'final_interview': 80,
      'offer_received': 90,
      'offer_accepted': 100,
      'offer_declined': 100,
      'rejected': 100,
      'withdrawn': 100
    };
    return progressMap[status] || 0;
  };

  // Quick stats cards
  const QuickStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold">{mockApplicationAnalytics.totalApplications}</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Applications</p>
              <p className="text-2xl font-bold text-blue-600">{getActiveApplications().length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Offers Received</p>
              <p className="text-2xl font-bold text-green-600">
                {mockApplicationAnalytics.applicationsByStatus.offer_received}
              </p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">{mockApplicationAnalytics.successRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Application Tracker</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your job applications across all profiles
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-1" />
          New Application
        </Button>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="phone_screening">Phone Screening</SelectItem>
                <SelectItem value="technical_interview">Technical Interview</SelectItem>
                <SelectItem value="offer_received">Offer Received</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={profileFilter} onValueChange={setProfileFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Profiles</SelectItem>
                <SelectItem value="profile-1">Senior Full Stack Developer</SelectItem>
                <SelectItem value="profile-2">Data Engineer</SelectItem>
                <SelectItem value="profile-3">Data Analyst</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date Applied</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="matchScore">Match Score</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Application Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({filteredApplications.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({getActiveApplications().length})</TabsTrigger>
          <TabsTrigger value="interviews">Interviews ({mockApplications.filter(app => 
            ['phone_screening', 'technical_interview', 'final_interview'].includes(app.status)
          ).length})</TabsTrigger>
          <TabsTrigger value="offers">Offers ({getApplicationsByStatus('offer_received').length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({getApplicationsByStatus('rejected').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {getApplicationsByCategory('active').map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {getApplicationsByCategory('interviews').map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {getApplicationsByCategory('offers').map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {getApplicationsByCategory('rejected').map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Application Details Dialog */}
      <Dialog open={showApplicationDetails} onOpenChange={setShowApplicationDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Detailed view of your job application
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Application Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Job Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Title:</strong> {selectedApplication.jobTitle}</p>
                    <p><strong>Company:</strong> {selectedApplication.company}</p>
                    <p><strong>Location:</strong> {selectedApplication.location}</p>
                    <p><strong>Work Type:</strong> {selectedApplication.workType}</p>
                    <p><strong>Salary:</strong> ${(selectedApplication.salaryRange[0] / 1000).toFixed(0)}k - ${(selectedApplication.salaryRange[1] / 1000).toFixed(0)}k</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Application Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Applied Date:</strong> {new Date(selectedApplication.appliedDate).toLocaleDateString()}</p>
                    <p><strong>Profile Used:</strong> {selectedApplication.profileName}</p>
                    <p><strong>Match Score:</strong> {selectedApplication.matchScore}%</p>
                    <p><strong>Current Status:</strong> {getStatusBadge(selectedApplication.status)}</p>
                    <p><strong>Last Updated:</strong> {new Date(selectedApplication.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Status History */}
              <div>
                <h3 className="font-semibold mb-2">Status History</h3>
                <div className="space-y-2">
                  {selectedApplication.statusHistory.map((status, index) => (
                    <div key={status.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <div className="text-sm">
                        <strong>{status.status.replace('_', ' ').toUpperCase()}</strong>
                        <p className="text-gray-600">{new Date(status.changedDate).toLocaleDateString()}</p>
                        {status.notes && <p className="text-gray-700 mt-1">{status.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interviews */}
              {selectedApplication.interviews.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Interviews</h3>
                  <div className="space-y-2">
                    {selectedApplication.interviews.map((interview) => (
                      <div key={interview.id} className="p-3 border rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{interview.type.replace('_', ' ').toUpperCase()} Interview</p>
                            <p className="text-sm text-gray-600">
                              {new Date(interview.scheduledDate).toLocaleDateString()} - {interview.interviewer}
                            </p>
                            {interview.notes && <p className="text-sm mt-1">{interview.notes}</p>}
                          </div>
                          <Badge variant={interview.outcome === 'passed' ? 'default' : 
                                         interview.outcome === 'failed' ? 'destructive' : 'secondary'}>
                            {interview.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedApplication.notes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <div className="space-y-1">
                    {selectedApplication.notes.map((note, index) => (
                      <p key={index} className="text-sm p-2 bg-blue-50 rounded">{note}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}