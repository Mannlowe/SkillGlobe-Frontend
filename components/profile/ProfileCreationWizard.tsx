'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Target,
  Code,
  Database,
  Brain,
  Palette,
  Server,
  Cloud,
  Bot,
  LineChart,
  BarChart3,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  Search,
  Filter,
  TrendingUp,
  Users,
  Star,
  Info,
  AlertCircle,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { 
  ProfileCategory, 
  ProfileCreationData, 
  SkillLevel, 
  ProfileTemplate,
  Skill
} from '@/types/multi-profile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  PROFILE_TEMPLATES, 
  getPopularTemplates, 
  getTrendingTemplates,
  TEMPLATE_CATEGORIES 
} from '@/lib/profileTemplates';

interface ProfileCreationWizardProps {
  onComplete: (profileData: ProfileCreationData) => void;
  onCancel: () => void;
  initialData?: Partial<ProfileCreationData>;
}

type WizardStep = 'template' | 'basic' | 'skills' | 'experience' | 'preferences' | 'review';

export default function ProfileCreationWizard({
  onComplete,
  onCancel,
  initialData
}: ProfileCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('template');
  const [profileData, setProfileData] = useState<ProfileCreationData>({
    name: '',
    description: '',
    category: ProfileCategory.FULL_STACK_DEVELOPER,
    skills: [],
    experience: [],
    preferences: {
      salaryRange: [80000, 150000],
      workType: [],
      jobTypes: [],
      industries: [],
      companySize: [],
      locations: [],
      travelWillingness: 0,
      availabilityDate: ''
    },
    ...initialData
  });

  const [selectedTemplate, setSelectedTemplate] = useState<ProfileTemplate | null>(null);
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateFilter, setTemplateFilter] = useState<'all' | 'popular' | 'trending'>('all');
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const steps: { id: WizardStep; title: string; description: string }[] = [
    { id: 'template', title: 'Choose Template', description: 'Select a career path template' },
    { id: 'basic', title: 'Basic Info', description: 'Profile name and description' },
    { id: 'skills', title: 'Skills', description: 'Add your skills and expertise' },
    { id: 'experience', title: 'Experience', description: 'Work history and achievements' },
    { id: 'preferences', title: 'Job Preferences', description: 'Salary, location, and work type' },
    { id: 'review', title: 'Review', description: 'Review and create profile' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

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
      default: return User;
    }
  };

  // Filter templates based on search and filter
  const getFilteredTemplates = () => {
    let templates = PROFILE_TEMPLATES;
    
    if (templateFilter === 'popular') {
      templates = getPopularTemplates();
    } else if (templateFilter === 'trending') {
      templates = getTrendingTemplates();
    }
    
    if (templateSearch) {
      templates = templates.filter(template =>
        template.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
        template.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
        template.typicalRoles.some(role => role.toLowerCase().includes(templateSearch.toLowerCase()))
      );
    }
    
    return templates;
  };

  const handleNext = () => {
    const stepIndex = steps.findIndex(step => step.id === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const stepIndex = steps.findIndex(step => step.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id);
    }
  };

  const handleTemplateSelect = (template: ProfileTemplate) => {
    setSelectedTemplate(template);
    setProfileData(prev => ({
      ...prev,
      category: template.category,
      name: template.name,
      description: template.description,
      skills: [...template.suggestedSkills.primary, ...template.suggestedSkills.secondary]
    }));
  };

  const addCustomSkill = () => {
    if (newSkill.trim() && !customSkills.includes(newSkill.trim())) {
      setCustomSkills(prev => [...prev, newSkill.trim()]);
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setCustomSkills(prev => prev.filter(s => s !== skill));
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleComplete = () => {
    onComplete(profileData);
  };

  // Template Selection Step
  const TemplateStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Career Path</h2>
        <p className="text-gray-600">
          Select a template that matches your career goals. We'll customize it for you.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search career paths..."
            value={templateSearch}
            onChange={(e) => setTemplateSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={templateFilter} onValueChange={(value) => setTemplateFilter(value as any)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Template Categories */}
      <div className="space-y-6">
        {TEMPLATE_CATEGORIES.map(category => {
          const categoryTemplates = getFilteredTemplates().filter(template =>
            category.categories.includes(template.category)
          );
          
          if (categoryTemplates.length === 0) return null;
          
          return (
            <div key={category.name}>
              <h3 className="text-lg font-semibold mb-3">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTemplates.map(template => {
                  const Icon = getCategoryIcon(template.category);
                  const isSelected = selectedTemplate?.id === template.id;
                  
                  return (
                    <Card
                      key={template.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        isSelected && "ring-2 ring-blue-500 bg-blue-50"
                      )}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              isSelected ? "bg-blue-500 text-white" : "bg-gray-100"
                            )}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{template.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={template.marketDemand === 'high' ? 'default' : 'secondary'} className="text-xs">
                                  {template.marketDemand} demand
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <TrendingUp className="w-3 h-3" />
                                  +{template.growthRate}%
                                </div>
                              </div>
                            </div>
                          </div>
                          {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-gray-700">Typical Roles:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.typicalRoles.slice(0, 3).map(role => (
                                <Badge key={role} variant="outline" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs font-medium text-gray-700">Key Skills:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.suggestedSkills.primary.slice(0, 4).map(skill => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500 pt-2">
                            Avg Salary: ${(template.avgSalaryRange[0] / 1000).toFixed(0)}k - ${(template.avgSalaryRange[1] / 1000).toFixed(0)}k
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Basic Info Step
  const BasicInfoStep = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Profile Details</h2>
        <p className="text-gray-600">
          Give your profile a name and description that represents your expertise.
        </p>
      </div>

      {selectedTemplate && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                {React.createElement(getCategoryIcon(selectedTemplate.category), { 
                  className: "w-4 h-4 text-white" 
                })}
              </div>
              <div>
                <p className="font-medium text-blue-900">Selected Template</p>
                <p className="text-sm text-blue-700">{selectedTemplate.name}</p>
              </div>
            </div>
            <p className="text-sm text-blue-700">{selectedTemplate.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="profile-name">Profile Name</Label>
          <Input
            id="profile-name"
            placeholder="e.g., Senior Full Stack Developer"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
          />
          <p className="text-xs text-gray-500 mt-1">
            Choose a specific title that describes your role and experience level
          </p>
        </div>

        <div>
          <Label htmlFor="profile-description">Profile Description</Label>
          <Textarea
            id="profile-description"
            placeholder="Describe your expertise, experience, and what makes you unique..."
            value={profileData.description}
            onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be your elevator pitch to potential employers (2-3 sentences recommended)
          </p>
        </div>
      </div>
    </div>
  );

  // Skills Step
  const SkillsStep = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Add Your Skills</h2>
        <p className="text-gray-600">
          Select from suggested skills or add your own to showcase your expertise.
        </p>
      </div>

      {selectedTemplate && (
        <div className="space-y-4">
          {/* Primary Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Primary Skills
            </h3>
            <p className="text-sm text-gray-600 mb-3">Core competencies for this role</p>
            <div className="flex flex-wrap gap-2">
              {selectedTemplate.suggestedSkills.primary.map(skill => {
                const isSelected = profileData.skills.includes(skill);
                return (
                  <Badge
                    key={skill}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-colors",
                      isSelected && "bg-blue-500"
                    )}
                    onClick={() => {
                      if (isSelected) {
                        setProfileData(prev => ({
                          ...prev,
                          skills: prev.skills.filter(s => s !== skill)
                        }));
                      } else {
                        setProfileData(prev => ({
                          ...prev,
                          skills: [...prev.skills, skill]
                        }));
                      }
                    }}
                  >
                    {isSelected && <Check className="w-3 h-3 mr-1" />}
                    {skill}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Secondary Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Secondary Skills</h3>
            <p className="text-sm text-gray-600 mb-3">Supporting technologies and tools</p>
            <div className="flex flex-wrap gap-2">
              {selectedTemplate.suggestedSkills.secondary.map(skill => {
                const isSelected = profileData.skills.includes(skill);
                return (
                  <Badge
                    key={skill}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-colors",
                      isSelected && "bg-green-500"
                    )}
                    onClick={() => {
                      if (isSelected) {
                        setProfileData(prev => ({
                          ...prev,
                          skills: prev.skills.filter(s => s !== skill)
                        }));
                      } else {
                        setProfileData(prev => ({
                          ...prev,
                          skills: [...prev.skills, skill]
                        }));
                      }
                    }}
                  >
                    {isSelected && <Check className="w-3 h-3 mr-1" />}
                    {skill}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Optional Skills */}
          {selectedTemplate.suggestedSkills.optional.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Optional Skills</h3>
              <p className="text-sm text-gray-600 mb-3">Nice to have skills for this role</p>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.suggestedSkills.optional.map(skill => {
                  const isSelected = profileData.skills.includes(skill);
                  return (
                    <Badge
                      key={skill}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isSelected && "bg-purple-500"
                      )}
                      onClick={() => {
                        if (isSelected) {
                          setProfileData(prev => ({
                            ...prev,
                            skills: prev.skills.filter(s => s !== skill)
                          }));
                        } else {
                          setProfileData(prev => ({
                            ...prev,
                            skills: [...prev.skills, skill]
                          }));
                        }
                      }}
                    >
                      {isSelected && <Check className="w-3 h-3 mr-1" />}
                      {skill}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Skills */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Custom Skills
        </h3>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
          />
          <Button onClick={addCustomSkill} disabled={!newSkill.trim()}>
            Add
          </Button>
        </div>
        
        {customSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {customSkills.map(skill => (
              <Badge
                key={skill}
                variant="secondary"
                className="cursor-pointer hover:bg-red-100"
                onClick={() => removeSkill(skill)}
              >
                {skill}
                <Trash2 className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Selected Skills Summary */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-base">Selected Skills ({profileData.skills.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map(skill => (
              <Badge key={skill} variant="default">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Experience Step (simplified for now)
  const ExperienceStep = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Work Experience</h2>
        <p className="text-gray-600">
          We'll help you add detailed experience after creating your profile.
        </p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 mb-1">Experience Setup</p>
              <p className="text-sm text-blue-700">
                You can add detailed work experience, achievements, and verify your employment after creating your profile.
                This helps you get started quickly while allowing you to enhance your profile later.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Job Preferences Step
  const PreferencesStep = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Job Preferences</h2>
        <p className="text-gray-600">
          Set your preferences to help us match you with relevant opportunities.
        </p>
      </div>

      <div className="space-y-6">
        {/* Salary Range */}
        <div>
          <Label className="text-base font-medium">Expected Salary Range</Label>
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>${((profileData.preferences.salaryRange?.[0] || 50000) / 1000).toFixed(0)}k</span>
              <span>${((profileData.preferences.salaryRange?.[1] || 150000) / 1000).toFixed(0)}k</span>
            </div>
            <Slider
              value={profileData.preferences.salaryRange || [50000, 150000]}
              onValueChange={(value) => setProfileData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, salaryRange: value as [number, number] }
              }))}
              min={30000}
              max={300000}
              step={5000}
              className="w-full"
            />
            {selectedTemplate && (
              <p className="text-xs text-gray-500 mt-2">
                Market range for {selectedTemplate.name}: ${(selectedTemplate.avgSalaryRange[0] / 1000).toFixed(0)}k - ${(selectedTemplate.avgSalaryRange[1] / 1000).toFixed(0)}k
              </p>
            )}
          </div>
        </div>

        {/* Work Type */}
        <div>
          <Label className="text-base font-medium mb-3 block">Work Type Preferences</Label>
          <div className="grid grid-cols-3 gap-3">
            {['remote', 'hybrid', 'onsite'].map(type => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  checked={profileData.preferences.workType?.includes(type as any) || false}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setProfileData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          workType: [...(prev.preferences.workType || []), type as any]
                        }
                      }));
                    } else {
                      setProfileData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          workType: (prev.preferences.workType || []).filter(t => t !== type)
                        }
                      }));
                    }
                  }}
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Job Types */}
        <div>
          <Label className="text-base font-medium mb-3 block">Employment Type</Label>
          <div className="grid grid-cols-3 gap-3">
            {['full_time', 'part_time', 'contract'].map(type => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  checked={profileData.preferences.jobTypes?.includes(type as any) || false}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setProfileData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          jobTypes: [...(prev.preferences.jobTypes || []), type as any]
                        }
                      }));
                    } else {
                      setProfileData(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          jobTypes: (prev.preferences.jobTypes || []).filter(t => t !== type)
                        }
                      }));
                    }
                  }}
                />
                <span className="capitalize">{type.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability Date */}
        <div>
          <Label htmlFor="availability" className="text-base font-medium">Available From</Label>
          <Input
            id="availability"
            type="date"
            value={profileData.preferences.availabilityDate}
            onChange={(e) => setProfileData(prev => ({
              ...prev,
              preferences: { ...prev.preferences, availabilityDate: e.target.value }
            }))}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );

  // Review Step
  const ReviewStep = () => (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Review Your Profile</h2>
        <p className="text-gray-600">
          Review your profile details before creating it. You can always edit these later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Profile Name</p>
              <p className="font-medium">{profileData.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Description</p>
              <p className="text-sm">{profileData.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Category</p>
              <Badge variant="secondary">
                {selectedTemplate?.name || profileData.category}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skills ({profileData.skills.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.slice(0, 10).map(skill => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {profileData.skills.length > 10 && (
                <Badge variant="secondary" className="text-xs">
                  +{profileData.skills.length - 10} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Preferences */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Job Preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Salary Range</p>
              <p className="font-medium">
                ${((profileData.preferences.salaryRange?.[0] || 50000) / 1000).toFixed(0)}k - 
                ${((profileData.preferences.salaryRange?.[1] || 150000) / 1000).toFixed(0)}k
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Work Type</p>
              <div className="flex flex-wrap gap-1">
                {(profileData.preferences.workType || []).map(type => (
                  <Badge key={type} variant="outline" className="text-xs capitalize">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Employment</p>
              <div className="flex flex-wrap gap-1">
                {profileData.preferences.jobTypes.map(type => (
                  <Badge key={type} variant="outline" className="text-xs capitalize">
                    {type.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Available From</p>
              <p className="font-medium">
                {profileData.preferences.availabilityDate ? 
                  new Date(profileData.preferences.availabilityDate).toLocaleDateString() : 
                  'Not specified'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900 mb-1">What's Next?</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Add detailed work experience and achievements</li>
                <li>• Upload certifications and portfolio items</li>
                <li>• Complete verification steps to boost your profile</li>
                <li>• Start receiving personalized job recommendations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 'template': return <TemplateStep />;
      case 'basic': return <BasicInfoStep />;
      case 'skills': return <SkillsStep />;
      case 'experience': return <ExperienceStep />;
      case 'preferences': return <PreferencesStep />;
      case 'review': return <ReviewStep />;
      default: return <TemplateStep />;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'template': return selectedTemplate !== null;
      case 'basic': return profileData.name.trim() && profileData.description.trim();
      case 'skills': return profileData.skills.length > 0;
      case 'experience': return true; // No requirements for now
      case 'preferences': return profileData.preferences.workType.length > 0 && profileData.preferences.jobTypes.length > 0;
      case 'review': return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Create New Profile</h1>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          
          {/* Step Indicators */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex-1 text-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium",
                    isActive && "bg-blue-500 text-white",
                    isCompleted && "bg-green-500 text-white",
                    !isActive && !isCompleted && "bg-gray-200 text-gray-600"
                  )}>
                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <p className={cn(
                    "text-xs font-medium",
                    isActive && "text-blue-600",
                    isCompleted && "text-green-600",
                    !isActive && !isCompleted && "text-gray-500"
                  )}>
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {currentStep === 'review' ? (
              <Button onClick={handleComplete} size="lg" disabled={!canProceed()}>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Profile
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}