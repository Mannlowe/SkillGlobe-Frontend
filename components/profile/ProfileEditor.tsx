'use client';

import React, { useState } from 'react';
import {
  Save,
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  Calendar,
  Building,
  Award,
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  User,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Info,
  Star
} from 'lucide-react';
import { 
  UserProfile, 
  ProfileCategory,
  SkillLevel,
  Skill,
  Experience,
  Achievement,
  Certification,
  ProfileJobPreferences
} from '@/types/multi-profile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { PROFILE_TEMPLATES } from '@/lib/profileTemplates';

interface ProfileEditorProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onCancel: () => void;
}

export default function ProfileEditor({
  profile,
  onSave,
  onCancel
}: ProfileEditorProps) {
  const [editedProfile, setEditedProfile] = useState<UserProfile>({ ...profile });
  const [activeTab, setActiveTab] = useState('basic');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));

  // Get skill level label
  const getSkillLevelLabel = (level: SkillLevel) => {
    switch (level) {
      case SkillLevel.BEGINNER: return 'Beginner';
      case SkillLevel.INTERMEDIATE: return 'Intermediate';
      case SkillLevel.PROFICIENT: return 'Proficient';
      case SkillLevel.ADVANCED: return 'Advanced';
      case SkillLevel.EXPERT: return 'Expert';
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleSave = () => {
    onSave(editedProfile);
  };

  const addSkill = (type: 'primary' | 'secondary' | 'learning') => {
    const newSkill: Skill = {
      name: '',
      level: SkillLevel.INTERMEDIATE,
      yearsExperience: 1,
      lastUsed: new Date().toISOString().split('T')[0],
      certifications: [],
      projects: []
    };

    setEditedProfile(prev => ({
      ...prev,
      [`${type}Skills`]: [...prev[`${type}Skills`], newSkill]
    }));
  };

  const updateSkill = (type: 'primary' | 'secondary' | 'learning', index: number, field: keyof Skill, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [`${type}Skills`]: prev[`${type}Skills`].map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (type: 'primary' | 'secondary' | 'learning', index: number) => {
    setEditedProfile(prev => ({
      ...prev,
      [`${type}Skills`]: prev[`${type}Skills`].filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: `exp-${Date.now()}`,
      title: '',
      company: '',
      duration: '',
      startDate: '',
      description: '',
      skills: [],
      achievements: [],
      verified: false
    };

    setEditedProfile(prev => ({
      ...prev,
      relevantExperience: [...prev.relevantExperience, newExperience]
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      relevantExperience: prev.relevantExperience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index: number) => {
    setEditedProfile(prev => ({
      ...prev,
      relevantExperience: prev.relevantExperience.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    const newCertification: Certification = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      issueDate: '',
      verified: false
    };

    setEditedProfile(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCertification]
    }));
  };

  const updateCertification = (index: number, field: keyof Certification, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (index: number) => {
    setEditedProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: `achievement-${Date.now()}`,
      title: '',
      description: '',
      date: '',
      category: '',
      verified: false
    };

    setEditedProfile(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement]
    }));
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) => 
        i === index ? { ...achievement, [field]: value } : achievement
      )
    }));
  };

  const removeAchievement = (index: number) => {
    setEditedProfile(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Basic Info Tab
  const BasicInfoTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile name and description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="profile-name">Profile Name</Label>
            <Input
              id="profile-name"
              value={editedProfile.name}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Senior Full Stack Developer"
            />
          </div>
          
          <div>
            <Label htmlFor="profile-description">Description</Label>
            <Textarea
              id="profile-description"
              value={editedProfile.description}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your expertise and what makes you unique..."
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="profile-category">Category</Label>
            <Select 
              value={editedProfile.category} 
              onValueChange={(value) => setEditedProfile(prev => ({ ...prev, category: value as ProfileCategory }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROFILE_TEMPLATES.map(template => (
                  <SelectItem key={template.category} value={template.category}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Profile Status</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                checked={editedProfile.isActive}
                onCheckedChange={(checked) => setEditedProfile(prev => ({ ...prev, isActive: checked }))}
              />
              <span className="text-sm">
                {editedProfile.isActive ? 'Active (visible to recruiters)' : 'Inactive (hidden from recruiters)'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Skills Tab
  const SkillsTab = () => (
    <div className="space-y-6">
      {/* Primary Skills */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Primary Skills
              </CardTitle>
              <CardDescription>Core competencies for this profile</CardDescription>
            </div>
            <Button onClick={() => addSkill('primary')} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {editedProfile.primarySkills.map((skill, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                <div className="col-span-3">
                  <Label>Skill Name</Label>
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill('primary', index, 'name', e.target.value)}
                    placeholder="e.g., React"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Level</Label>
                  <Select 
                    value={skill.level.toString()} 
                    onValueChange={(value) => updateSkill('primary', index, 'level', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(SkillLevel).filter(v => typeof v === 'number').map(level => (
                        <SelectItem key={level} value={level.toString()}>
                          {getSkillLevelLabel(level as SkillLevel)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Years Experience</Label>
                  <Input
                    type="number"
                    value={skill.yearsExperience}
                    onChange={(e) => updateSkill('primary', index, 'yearsExperience', parseInt(e.target.value) || 0)}
                    min="0"
                    max="50"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Last Used</Label>
                  <Input
                    type="date"
                    value={skill.lastUsed}
                    onChange={(e) => updateSkill('primary', index, 'lastUsed', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Projects</Label>
                  <Input
                    value={skill.projects.join(', ')}
                    onChange={(e) => updateSkill('primary', index, 'projects', e.target.value.split(', ').filter(p => p.trim()))}
                    placeholder="Project names..."
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill('primary', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Secondary Skills */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Secondary Skills</CardTitle>
              <CardDescription>Supporting technologies and tools</CardDescription>
            </div>
            <Button onClick={() => addSkill('secondary')} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {editedProfile.secondarySkills.map((skill, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                <div className="col-span-4">
                  <Label>Skill Name</Label>
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill('secondary', index, 'name', e.target.value)}
                    placeholder="e.g., Docker"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Level</Label>
                  <Select 
                    value={skill.level.toString()} 
                    onValueChange={(value) => updateSkill('secondary', index, 'level', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(SkillLevel).filter(v => typeof v === 'number').map(level => (
                        <SelectItem key={level} value={level.toString()}>
                          {getSkillLevelLabel(level as SkillLevel)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Years Experience</Label>
                  <Input
                    type="number"
                    value={skill.yearsExperience}
                    onChange={(e) => updateSkill('secondary', index, 'yearsExperience', parseInt(e.target.value) || 0)}
                    min="0"
                    max="50"
                  />
                </div>
                <div className="col-span-3">
                  <Label>Last Used</Label>
                  <Input
                    type="date"
                    value={skill.lastUsed}
                    onChange={(e) => updateSkill('secondary', index, 'lastUsed', e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill('secondary', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Skills */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Currently Learning</CardTitle>
              <CardDescription>Skills you're actively developing</CardDescription>
            </div>
            <Button onClick={() => addSkill('learning')} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {editedProfile.learningSkills.map((skill, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 items-end p-4 border rounded-lg border-purple-200 bg-purple-50">
                <div className="col-span-2">
                  <Label>Skill Name</Label>
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill('learning', index, 'name', e.target.value)}
                    placeholder="e.g., Kubernetes"
                  />
                </div>
                <div className="col-span-1">
                  <Label>Level</Label>
                  <Select 
                    value={skill.level.toString()} 
                    onValueChange={(value) => updateSkill('learning', index, 'level', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(SkillLevel).filter(v => typeof v === 'number').map(level => (
                        <SelectItem key={level} value={level.toString()}>
                          {getSkillLevelLabel(level as SkillLevel)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1">
                  <Label>Experience (months)</Label>
                  <Input
                    type="number"
                    value={Math.round(skill.yearsExperience * 12)}
                    onChange={(e) => updateSkill('learning', index, 'yearsExperience', (parseInt(e.target.value) || 0) / 12)}
                    min="0"
                    max="24"
                  />
                </div>
                <div className="col-span-1">
                  <Label>Last Used</Label>
                  <Input
                    type="date"
                    value={skill.lastUsed}
                    onChange={(e) => updateSkill('learning', index, 'lastUsed', e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill('learning', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Experience Tab
  const ExperienceTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Add and edit your professional experience</CardDescription>
            </div>
            <Button onClick={addExperience}>
              <Plus className="w-4 h-4 mr-1" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {editedProfile.relevantExperience.map((experience, index) => (
              <div key={experience.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Experience #{index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Job Title</Label>
                    <Input
                      value={experience.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={experience.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      placeholder="e.g., Tech Corp"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={experience.startDate}
                      onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={experience.endDate || ''}
                      onChange={(e) => updateExperience(index, 'endDate', e.target.value || undefined)}
                    />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={experience.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      placeholder="e.g., 2 years 6 months"
                    />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={experience.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    placeholder="Describe your role and responsibilities..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Key Achievements</Label>
                  <Textarea
                    value={experience.achievements.join('\n')}
                    onChange={(e) => updateExperience(index, 'achievements', e.target.value.split('\n').filter(a => a.trim()))}
                    placeholder="List your key achievements (one per line)..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Skills Used</Label>
                  <Input
                    value={experience.skills.join(', ')}
                    onChange={(e) => updateExperience(index, 'skills', e.target.value.split(', ').filter(s => s.trim()))}
                    placeholder="React, Node.js, MongoDB..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={experience.verified}
                    onCheckedChange={(checked) => updateExperience(index, 'verified', checked)}
                  />
                  <Label className="text-sm">This experience has been verified</Label>
                </div>
              </div>
            ))}

            {editedProfile.relevantExperience.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No work experience added yet</p>
                <p className="text-sm">Click "Add Experience" to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Achievements Tab
  const AchievementsTab = () => (
    <div className="space-y-6">
      {/* Certifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>Professional certifications and credentials</CardDescription>
            </div>
            <Button onClick={addCertification}>
              <Plus className="w-4 h-4 mr-1" />
              Add Certification
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {editedProfile.certifications.map((cert, index) => (
              <div key={cert.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Certification #{index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertification(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Certification Name</Label>
                    <Input
                      value={cert.name}
                      onChange={(e) => updateCertification(index, 'name', e.target.value)}
                      placeholder="e.g., AWS Solutions Architect"
                    />
                  </div>
                  <div>
                    <Label>Issuing Organization</Label>
                    <Input
                      value={cert.issuer}
                      onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                      placeholder="e.g., Amazon Web Services"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Issue Date</Label>
                    <Input
                      type="date"
                      value={cert.issueDate}
                      onChange={(e) => updateCertification(index, 'issueDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      value={cert.expiryDate || ''}
                      onChange={(e) => updateCertification(index, 'expiryDate', e.target.value || undefined)}
                    />
                  </div>
                  <div>
                    <Label>Credential ID</Label>
                    <Input
                      value={cert.credentialId || ''}
                      onChange={(e) => updateCertification(index, 'credentialId', e.target.value)}
                      placeholder="Credential ID"
                    />
                  </div>
                </div>

                <div>
                  <Label>Verification URL</Label>
                  <Input
                    value={cert.verificationUrl || ''}
                    onChange={(e) => updateCertification(index, 'verificationUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={cert.verified}
                    onCheckedChange={(checked) => updateCertification(index, 'verified', checked)}
                  />
                  <Label className="text-sm">This certification has been verified</Label>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Notable accomplishments and milestones</CardDescription>
            </div>
            <Button onClick={addAchievement} variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Achievement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {editedProfile.achievements.map((achievement, index) => (
              <div key={achievement.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Achievement #{index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={achievement.title}
                      onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                      placeholder="e.g., Employee of the Year"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={achievement.category}
                      onChange={(e) => updateAchievement(index, 'category', e.target.value)}
                      placeholder="e.g., Award, Recognition, Milestone"
                    />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={achievement.description}
                    onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                    placeholder="Describe the achievement..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={achievement.date}
                      onChange={(e) => updateAchievement(index, 'date', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      checked={achievement.verified}
                      onCheckedChange={(checked) => updateAchievement(index, 'verified', checked)}
                    />
                    <Label className="text-sm">Verified achievement</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Job Preferences Tab
  const PreferencesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Preferences</CardTitle>
          <CardDescription>Set your job search preferences and requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Salary Range */}
          <div>
            <Label className="text-base font-medium">Expected Salary Range</Label>
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>${(editedProfile.jobPreferences.salaryRange[0] / 1000).toFixed(0)}k</span>
                <span>${(editedProfile.jobPreferences.salaryRange[1] / 1000).toFixed(0)}k</span>
              </div>
              <Slider
                value={editedProfile.jobPreferences.salaryRange}
                onValueChange={(value) => setEditedProfile(prev => ({
                  ...prev,
                  jobPreferences: { ...prev.jobPreferences, salaryRange: value as [number, number] }
                }))}
                min={30000}
                max={300000}
                step={5000}
                className="w-full"
              />
            </div>
          </div>

          {/* Work Type */}
          <div>
            <Label className="text-base font-medium mb-3 block">Work Type Preferences</Label>
            <div className="grid grid-cols-3 gap-3">
              {['remote', 'hybrid', 'onsite'].map(type => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={editedProfile.jobPreferences.workType.includes(type as any)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setEditedProfile(prev => ({
                          ...prev,
                          jobPreferences: {
                            ...prev.jobPreferences,
                            workType: [...prev.jobPreferences.workType, type as any]
                          }
                        }));
                      } else {
                        setEditedProfile(prev => ({
                          ...prev,
                          jobPreferences: {
                            ...prev.jobPreferences,
                            workType: prev.jobPreferences.workType.filter(t => t !== type)
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
                    checked={editedProfile.jobPreferences.jobTypes.includes(type as any)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setEditedProfile(prev => ({
                          ...prev,
                          jobPreferences: {
                            ...prev.jobPreferences,
                            jobTypes: [...prev.jobPreferences.jobTypes, type as any]
                          }
                        }));
                      } else {
                        setEditedProfile(prev => ({
                          ...prev,
                          jobPreferences: {
                            ...prev.jobPreferences,
                            jobTypes: prev.jobPreferences.jobTypes.filter(t => t !== type)
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

          {/* Industries */}
          <div>
            <Label>Preferred Industries</Label>
            <Input
              value={editedProfile.jobPreferences.industries.join(', ')}
              onChange={(e) => setEditedProfile(prev => ({
                ...prev,
                jobPreferences: {
                  ...prev.jobPreferences,
                  industries: e.target.value.split(', ').filter(i => i.trim())
                }
              }))}
              placeholder="Technology, Fintech, Healthcare..."
              className="mt-2"
            />
          </div>

          {/* Locations */}
          <div>
            <Label>Preferred Locations</Label>
            <Input
              value={editedProfile.jobPreferences.locations.join(', ')}
              onChange={(e) => setEditedProfile(prev => ({
                ...prev,
                jobPreferences: {
                  ...prev.jobPreferences,
                  locations: e.target.value.split(', ').filter(l => l.trim())
                }
              }))}
              placeholder="Mumbai, Remote, Bangalore..."
              className="mt-2"
            />
          </div>

          {/* Travel Willingness */}
          <div>
            <Label className="text-base font-medium">Travel Willingness: {editedProfile.jobPreferences.travelWillingness}%</Label>
            <Slider
              value={[editedProfile.jobPreferences.travelWillingness]}
              onValueChange={(value) => setEditedProfile(prev => ({
                ...prev,
                jobPreferences: { ...prev.jobPreferences, travelWillingness: value[0] }
              }))}
              min={0}
              max={100}
              step={5}
              className="w-full mt-2"
            />
          </div>

          {/* Availability Date */}
          <div>
            <Label>Available From</Label>
            <Input
              type="date"
              value={editedProfile.jobPreferences.availabilityDate}
              onChange={(e) => setEditedProfile(prev => ({
                ...prev,
                jobPreferences: { ...prev.jobPreferences, availabilityDate: e.target.value }
              }))}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Edit Profile</h1>
              <p className="text-gray-600 mt-1">Update your {profile.name} profile information</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="basic">
              <BasicInfoTab />
            </TabsContent>
            <TabsContent value="skills">
              <SkillsTab />
            </TabsContent>
            <TabsContent value="experience">
              <ExperienceTab />
            </TabsContent>
            <TabsContent value="achievements">
              <AchievementsTab />
            </TabsContent>
            <TabsContent value="preferences">
              <PreferencesTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}