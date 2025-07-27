'use client';

import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Code,
  Database,
  Brain,
  Palette,
  Server,
  Cloud,
  Bot,
  LineChart,
  Building,
  ChevronRight,
  Settings,
  Copy,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Filter,
  Search,
  Grid,
  List
} from 'lucide-react';
import { 
  UserProfile, 
  ProfileCategory,
  ProfilePerformanceMetrics,
  User
} from '@/types/multi-profile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { PROFILE_TEMPLATES } from '@/lib/profileTemplates';

interface ProfileDashboardProps {
  user: User;
  profileMetrics: Map<string, ProfilePerformanceMetrics>;
  onCreateProfile: () => void;
  onEditProfile: (profileId: string) => void;
  onDeleteProfile: (profileId: string) => void;
  onViewProfile: (profileId: string) => void;
  onDuplicateProfile: (profileId: string) => void;
  onSetDefaultProfile: (profileId: string) => void;
  onToggleProfileActive: (profileId: string, active: boolean) => void;
}

export default function ProfileDashboard({
  user,
  profileMetrics,
  onCreateProfile,
  onEditProfile,
  onDeleteProfile,
  onViewProfile,
  onDuplicateProfile,
  onSetDefaultProfile,
  onToggleProfileActive
}: ProfileDashboardProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<ProfileCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'performance' | 'name'>('recent');

  // Get category icon
  const getCategoryIcon = (category: ProfileCategory) => {
    switch (category) {
      case ProfileCategory.DATA_ENGINEER: return Database;
      case ProfileCategory.DATA_ANALYST: return LineChart;
      case ProfileCategory.DATA_SCIENTIST: return Brain;
      case ProfileCategory.FULL_STACK_DEVELOPER: return Code;
      case ProfileCategory.FRONTEND_DEVELOPER: return Palette;
      case ProfileCategory.BACKEND_DEVELOPER: return Server;
      case ProfileCategory.DEVOPS_ENGINEER: return Cloud;
      case ProfileCategory.ML_ENGINEER: return Bot;
      case ProfileCategory.PRODUCT_MANAGER: return Target;
      case ProfileCategory.BUSINESS_ANALYST: return BarChart3;
      default: return Users;
    }
  };

  // Filter and sort profiles
  const filteredProfiles = user.profiles
    .filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          profile.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || profile.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'performance':
          const metricsA = profileMetrics.get(a.id);
          const metricsB = profileMetrics.get(b.id);
          return (metricsB?.responseRate || 0) - (metricsA?.responseRate || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
        default:
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
    });

  // Calculate overall stats
  const totalProfiles = user.profiles.length;
  const activeProfiles = user.profiles.filter(p => p.isActive).length;
  const totalApplications = Array.from(profileMetrics.values())
    .reduce((sum, metrics) => sum + metrics.applicationsSubmitted, 0);
  const avgResponseRate = Array.from(profileMetrics.values())
    .reduce((sum, metrics, _, arr) => sum + metrics.responseRate / arr.length, 0);

  const ProfileCard = ({ profile }: { profile: UserProfile }) => {
    const metrics = profileMetrics.get(profile.id);
    const template = PROFILE_TEMPLATES.find(t => t.category === profile.category);
    const CategoryIcon = getCategoryIcon(profile.category);
    const isDefault = user.defaultProfile === profile.id;

    return (
      <Card className={cn(
        "relative transition-all hover:shadow-md",
        !profile.isActive && "opacity-60"
      )}>
        {/* Default Profile Badge */}
        {isDefault && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-blue-500 text-white flex items-center gap-1">
              <Star className="w-3 h-3" />
              Default
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                profile.isActive ? "bg-blue-100" : "bg-gray-100"
              )}>
                <CategoryIcon className={cn(
                  "w-5 h-5",
                  profile.isActive ? "text-blue-600" : "text-gray-400"
                )} />
              </div>
              <div>
                <CardTitle className="text-base">{profile.name}</CardTitle>
                <Badge variant="secondary" className="text-xs mt-1">
                  {template?.name || profile.category}
                </Badge>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewProfile(profile.id)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditProfile(profile.id)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicateProfile(profile.id)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {!isDefault && (
                  <DropdownMenuItem onClick={() => onSetDefaultProfile(profile.id)}>
                    <Star className="w-4 h-4 mr-2" />
                    Set as Default
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => onToggleProfileActive(profile.id, !profile.isActive)}
                >
                  {profile.isActive ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDeleteProfile(profile.id)}
                  className="text-red-600"
                  disabled={isDefault}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 line-clamp-2">{profile.description}</p>
          
          {/* Skills Summary */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {profile.primarySkills.length} Primary
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {profile.secondarySkills.length} Secondary
              </Badge>
            </div>
          </div>

          {/* Performance Metrics */}
          {metrics && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Applications</span>
                <span className="font-medium">{metrics.applicationsSubmitted}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Response Rate</span>
                <div className="flex items-center gap-2">
                  <Progress value={metrics.responseRate} className="w-16 h-2" />
                  <span className="font-medium">{metrics.responseRate}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Market Trend</span>
                <Badge 
                  variant={metrics.marketTrend === 'increasing' ? 'default' : 
                          metrics.marketTrend === 'stable' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {metrics.marketTrend}
                </Badge>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
            <span>Updated {new Date(profile.lastUpdated).toLocaleDateString()}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1">
                    {profile.isActive ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-gray-400" />
                    )}
                    <span>{profile.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{profile.isActive ? 'This profile is visible to recruiters' : 'This profile is hidden from recruiters'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>

        <CardFooter className="pt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onViewProfile(profile.id)}
          >
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProfiles}</div>
            <p className="text-xs text-gray-500 mt-1">{activeProfiles} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-gray-500 mt-1">Across all profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseRate.toFixed(1)}%</div>
            <Progress value={avgResponseRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full" onClick={onCreateProfile}>
              <Plus className="w-4 h-4 mr-1" />
              Create New Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Profiles Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Profiles</CardTitle>
              <CardDescription>
                Manage your specialized professional profiles
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(viewMode === 'grid' && "bg-gray-100")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(viewMode === 'list' && "bg-gray-100")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search profiles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as ProfileCategory | 'all')}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.values(ProfileCategory).map(category => {
                  const template = PROFILE_TEMPLATES.find(t => t.category === category);
                  return (
                    <SelectItem key={category} value={category}>
                      {template?.name || category}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'recent' | 'performance' | 'name')}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Profiles Grid/List */}
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || filterCategory !== 'all' ? 'No profiles found' : 'No profiles yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Create your first specialized profile to get started'}
              </p>
              {!searchQuery && filterCategory === 'all' && (
                <Button onClick={onCreateProfile}>
                  <Plus className="w-4 h-4 mr-1" />
                  Create Your First Profile
                </Button>
              )}
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProfiles.map(profile => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProfiles.map(profile => {
                    const metrics = profileMetrics.get(profile.id);
                    const template = PROFILE_TEMPLATES.find(t => t.category === profile.category);
                    const CategoryIcon = getCategoryIcon(profile.category);
                    const isDefault = user.defaultProfile === profile.id;

                    return (
                      <Card key={profile.id} className={cn(
                        "transition-all",
                        !profile.isActive && "opacity-60"
                      )}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className={cn(
                                "w-12 h-12 rounded-lg flex items-center justify-center",
                                profile.isActive ? "bg-blue-100" : "bg-gray-100"
                              )}>
                                <CategoryIcon className={cn(
                                  "w-6 h-6",
                                  profile.isActive ? "text-blue-600" : "text-gray-400"
                                )} />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{profile.name}</h3>
                                  {isDefault && (
                                    <Badge className="bg-blue-500 text-white text-xs">
                                      <Star className="w-3 h-3 mr-1" />
                                      Default
                                    </Badge>
                                  )}
                                  <Badge variant="secondary" className="text-xs">
                                    {template?.name || profile.category}
                                  </Badge>
                                  {profile.isActive ? (
                                    <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                                      Active
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-xs">
                                      Inactive
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{profile.description}</p>
                                
                                {metrics && (
                                  <div className="flex items-center gap-6 mt-2 text-sm">
                                    <span className="text-gray-600">
                                      <strong>{metrics.applicationsSubmitted}</strong> applications
                                    </span>
                                    <span className="text-gray-600">
                                      <strong>{metrics.responseRate}%</strong> response rate
                                    </span>
                                    <Badge 
                                      variant={metrics.marketTrend === 'increasing' ? 'default' : 
                                              metrics.marketTrend === 'stable' ? 'secondary' : 'destructive'}
                                      className="text-xs"
                                    >
                                      {metrics.marketTrend} market
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => onViewProfile(profile.id)}>
                                View
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => onEditProfile(profile.id)}>
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onDuplicateProfile(profile.id)}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  {!isDefault && (
                                    <DropdownMenuItem onClick={() => onSetDefaultProfile(profile.id)}>
                                      <Star className="w-4 h-4 mr-2" />
                                      Set as Default
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => onDeleteProfile(profile.id)}
                                    className="text-red-600"
                                    disabled={isDefault}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Profile Management Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Specialize Your Profiles</h4>
              <p className="text-gray-600">Create targeted profiles for different career paths to improve match rates.</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Keep Profiles Updated</h4>
              <p className="text-gray-600">Regularly update skills and experience to maintain relevance.</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Monitor Performance</h4>
              <p className="text-gray-600">Track which profiles get the best response rates and optimize accordingly.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}