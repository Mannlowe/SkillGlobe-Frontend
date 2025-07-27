'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Building,
  MapPin,
  DollarSign,
  User,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  BarChart3,
  Eye,
  Search,
  ArrowUpDown
} from 'lucide-react';
import { 
  JobApplication, 
  ApplicationStatus,
  ApplicationAnalytics 
} from '@/types/application-tracking';
import { 
  mockApplications, 
  mockApplicationAnalytics 
} from '@/lib/mockApplicationData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function ApplicationHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [profileFilter, setProfileFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  // Filter applications
  const filteredApplications = useMemo(() => {
    let filtered = mockApplications;

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.jobTitle.toLowerCase().includes(query) ||
        app.company.toLowerCase().includes(query) ||
        app.profileName.toLowerCase().includes(query) ||
        app.location.toLowerCase().includes(query)
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

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(app => new Date(app.appliedDate) >= filterDate);
      }
    }

    // Sort applications
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
        case 'title':
          aValue = a.jobTitle;
          bValue = b.jobTitle;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'match':
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
  }, [searchQuery, statusFilter, profileFilter, dateFilter, sortBy, sortOrder]);

  // Status configuration
  const statusConfig = {
    'submitted': { label: 'Submitted', color: 'bg-blue-100 text-blue-800', icon: Clock },
    'under_review': { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800', icon: Eye },
    'phone_screening': { label: 'Phone Screen', color: 'bg-purple-100 text-purple-800', icon: Clock },
    'technical_interview': { label: 'Technical', color: 'bg-purple-100 text-purple-800', icon: Clock },
    'final_interview': { label: 'Final', color: 'bg-purple-100 text-purple-800', icon: Clock },
    'offer_received': { label: 'Offer', color: 'bg-green-100 text-green-800', icon: Award },
    'offer_accepted': { label: 'Accepted', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    'offer_declined': { label: 'Declined', color: 'bg-gray-100 text-gray-800', icon: XCircle },
    'rejected': { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
    'withdrawn': { label: 'Withdrawn', color: 'bg-gray-100 text-gray-800', icon: XCircle }
  };

  // Analytics summary component
  const AnalyticsSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold">{mockApplicationAnalytics.totalApplications}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              This month: {mockApplicationAnalytics.applicationsThisMonth}
            </p>
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
          <div className="mt-2">
            <Progress value={mockApplicationAnalytics.successRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Match Score</p>
              <p className="text-2xl font-bold text-blue-600">{mockApplicationAnalytics.averageMatchScore}%</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2">
            <Progress value={mockApplicationAnalytics.averageMatchScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-purple-600">{mockApplicationAnalytics.averageResponseTime} days</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              Best performing: {mockApplicationAnalytics.topPerformingProfile.profileName}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Application card component
  const ApplicationCard = ({ application }: { application: JobApplication }) => {
    const statusConf = statusConfig[application.status as keyof typeof statusConfig];
    const Icon = statusConf?.icon || Clock;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{application.jobTitle}</CardTitle>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
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
              </div>
            </div>
            <Badge className={cn("flex items-center gap-1", statusConf?.color)}>
              <Icon className="w-3 h-3" />
              {statusConf?.label}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4 text-gray-500" />
              <span>Profile: {application.profileName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-gray-500" />
              <span>Match: {application.matchScore}%</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span>${(application.salaryRange[0] / 1000).toFixed(0)}k - ${(application.salaryRange[1] / 1000).toFixed(0)}k</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{application.workType}</span>
            </div>
          </div>

          {/* Status timeline mini */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{application.statusHistory.length} updates</span>
            </div>
            <Progress value={getStatusProgress(application.status)} className="h-2" />
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedApplication(application);
                setShowDetails(true);
              }}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            
            {application.responseTime && (
              <span className="text-xs text-gray-500">
                Response: {application.responseTime} days
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Table row component
  const ApplicationRow = ({ application }: { application: JobApplication }) => {
    const statusConf = statusConfig[application.status as keyof typeof statusConfig];
    
    return (
      <TableRow className="hover:bg-gray-50">
        <TableCell>
          <div>
            <p className="font-medium">{application.jobTitle}</p>
            <p className="text-sm text-gray-600">{application.company}</p>
          </div>
        </TableCell>
        <TableCell>{application.profileName}</TableCell>
        <TableCell>
          <Badge className={statusConf?.color}>
            {statusConf?.label}
          </Badge>
        </TableCell>
        <TableCell>{new Date(application.appliedDate).toLocaleDateString()}</TableCell>
        <TableCell>{application.matchScore}%</TableCell>
        <TableCell>${(application.salaryRange[0] / 1000).toFixed(0)}k - ${(application.salaryRange[1] / 1000).toFixed(0)}k</TableCell>
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedApplication(application);
              setShowDetails(true);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  // Get status progress percentage
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Application History</h1>
          <p className="text-gray-600 mt-1">
            Complete history of your job applications with profile context
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}>
            {viewMode === 'cards' ? 'Table View' : 'Card View'}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Summary */}
      <AnalyticsSummary />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                {Object.entries(statusConfig).map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    {config.label}
                  </SelectItem>
                ))}
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
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date Applied</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="title">Job Title</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="match">Match Score</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications Display */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <ApplicationRow key={application.id} application={application} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No applications found matching your criteria</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Complete details and timeline for this application
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Application Overview */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Job Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium">{selectedApplication.jobTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company:</span>
                      <span className="font-medium">{selectedApplication.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedApplication.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Work Type:</span>
                      <span className="font-medium capitalize">{selectedApplication.workType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary:</span>
                      <span className="font-medium">
                        ${(selectedApplication.salaryRange[0] / 1000).toFixed(0)}k - ${(selectedApplication.salaryRange[1] / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Application Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Applied Date:</span>
                      <span className="font-medium">{new Date(selectedApplication.appliedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profile Used:</span>
                      <span className="font-medium">{selectedApplication.profileName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Match Score:</span>
                      <span className="font-medium">{selectedApplication.matchScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Status:</span>
                      <span>{statusConfig[selectedApplication.status as keyof typeof statusConfig]?.label}</span>
                    </div>
                    {selectedApplication.responseTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Time:</span>
                        <span className="font-medium">{selectedApplication.responseTime} days</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div>
                <h3 className="font-semibold mb-3">Application Timeline</h3>
                <div className="space-y-3">
                  {selectedApplication.statusHistory.map((status, index) => {
                    const isLatest = index === selectedApplication.statusHistory.length - 1;
                    const statusConf = statusConfig[status.status as keyof typeof statusConfig];
                    const Icon = statusConf?.icon || Clock;
                    
                    return (
                      <div key={status.id} className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border",
                        isLatest ? "border-blue-200 bg-blue-50" : "border-gray-200"
                      )}>
                        <div className="p-2 rounded-full bg-white border">
                          <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{statusConf?.label}</span>
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

              {/* Notes */}
              {selectedApplication.notes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Notes</h3>
                  <div className="space-y-2">
                    {selectedApplication.notes.map((note, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interviews */}
              {selectedApplication.interviews.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Interviews</h3>
                  <div className="space-y-3">
                    {selectedApplication.interviews.map((interview) => (
                      <div key={interview.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium capitalize">{interview.type} Interview</p>
                            <p className="text-sm text-gray-600">
                              {new Date(interview.scheduledDate).toLocaleDateString()} - {interview.interviewer}
                            </p>
                          </div>
                          <Badge variant={
                            interview.outcome === 'passed' ? 'default' : 
                            interview.outcome === 'failed' ? 'destructive' : 'secondary'
                          }>
                            {interview.status}
                          </Badge>
                        </div>
                        {interview.notes && (
                          <p className="text-sm text-gray-600">{interview.notes}</p>
                        )}
                        {interview.feedback && (
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Feedback:</strong> {interview.feedback}
                          </p>
                        )}
                      </div>
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