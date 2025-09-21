'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  AlertCircle, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Target,
  Zap,
  Star,
  MessageSquare,
  Calendar,
  Trophy,
  ChevronRight,
  X,
  Brain,
  Eye,
  Lightbulb,
  Users,
  Shield,
  Mail,
  Phone,
  Award,
  GraduationCap,
  Briefcase,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useVerification } from '@/contexts/VerificationContext';
import { useAuthStore } from '@/store';

interface DynamicSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

interface ContextualAction {
  id: string;
  title: string;
  description?: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  value?: string;
  progress?: number;
  action?: () => void;
  actionUrl?: string;
  decay?: boolean; // For skill decay warnings
  trending?: boolean; // For trending indicators
}

export default function DynamicSidebar({ isOpen, onClose, isMobile = false }: DynamicSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { verificationStatus, getVerificationScore, getNextVerificationStep } = useVerification();

  const [userName, setUserName] = useState('User');
  const { user, isAuthenticated } = useAuthStore();
  const [isBoostHovered, setIsBoostHovered] = useState(false);
  
  const [contextualData, setContextualData] = useState<{
    profileHealth: number;
    todos: ContextualAction[];
    stats: ContextualAction[];
    smartActions: ContextualAction[];
    opportunities: ContextualAction[];
    insights: ContextualAction[];
    careerCoach: ContextualAction[];
    skillAlerts: ContextualAction[];
    trendingSkills: ContextualAction[];
    interviewPipeline: ContextualAction[];
    loading: boolean;
  }>({
    profileHealth: 99,
    todos: [],
    stats: [],
    smartActions: [],
    opportunities: [],
    insights: [],
    careerCoach: [],
    skillAlerts: [],
    trendingSkills: [],
    interviewPipeline: [],
    loading: false
  });

  useEffect(() => {
    loadContextualData(pathname);
  }, [pathname]);

  const loadContextualData = async (path: string) => {
    setContextualData(prev => ({ ...prev, loading: true }));
    
    try {
      // Generate context-specific data based on current page
      const contextActions = getContextualContent(path);
      
      setContextualData(prev => ({
        ...prev,
        ...contextActions,
        loading: false
      }));
    } catch (error) {
      console.error('Error loading contextual data:', error);
      setContextualData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (isAuthenticated && user && window.location.pathname.includes('individual-dashboard')) {
      setUserName(user.full_name || user.name);
    }
  }, [isAuthenticated, user]);

  const getContextualContent = (path: string) => {
    if (path.includes('dashboard')) {
      return {
        profileHealth: 55,
        todos: [
          // { id: '1', title: 'Complete email verification', icon: '📧', priority: 'high' as const, actionUrl: '/verification?step=email' },
          { id: '2', title: 'Add 3 more skills', icon: '🧠', priority: 'medium' as const, actionUrl: '/skills' },
          { id: '3', title: 'Update portfolio', icon: '💼', priority: 'medium' as const, actionUrl: '/portfolio' }
        ],
        stats: [
          { id: '1', title: 'Profile views today', icon: '👁️', priority: 'low' as const, value: '12' },
          { id: '2', title: 'New opportunity matches', icon: '🎯', priority: 'low' as const, value: '3' },
          { id: '3', title: 'React trending', icon: '🔥', priority: 'low' as const, value: '+25%', trending: true }
        ],
        smartActions: [
          { id: '1', title: 'Apply to Frontend roles', icon: '🚀', priority: 'high' as const, actionUrl: '/opportunities' },
          { id: '2', title: 'Schedule skill assessment', icon: '📅', priority: 'medium' as const },
          { id: '3', title: 'Update availability', icon: '✅', priority: 'low' as const }
        ],
        skillAlerts: [
          { id: '1', title: 'Angular skills expiring', icon: '⚠️', priority: 'high' as const, description: 'No activity in 6 months', decay: true, actionUrl: '/skills' },
          { id: '2', title: 'Python certification expiring', icon: '⏳', priority: 'medium' as const, description: 'Expires in 30 days', decay: true }
        ],
        trendingSkills: [
          { id: '1', title: 'TypeScript', icon: '📈', priority: 'low' as const, value: '+45%', trending: true, description: 'High demand in your area' },
          { id: '2', title: 'Next.js', icon: '🔥', priority: 'low' as const, value: '+32%', trending: true, description: 'Growing fast' }
        ]
      };
    }
    
    if (path.includes('opportunities')) {
      return {
        profileHealth: 92,
        todos: [
          { id: '1', title: 'Verify identity for premium jobs', icon: '🔒', priority: 'high' as const, actionUrl: '/verification' },
          { id: '2', title: 'Complete skill tests', icon: '🧪', priority: 'medium' as const }
        ],
        stats: [
          { id: '1', title: 'Match quality score', icon: '📊', priority: 'low' as const, value: '94%' },
          { id: '2', title: 'Active applications', icon: '📋', priority: 'low' as const, value: '7' },
          { id: '3', title: 'Interview pipeline', icon: '🎭', priority: 'low' as const, value: '2' }
        ],
        opportunities: [
          { id: '1', title: 'Interview: TechCorp (2 days)', icon: '🎯', priority: 'high' as const },
          { id: '2', title: 'Application: StartupXYZ', icon: '📄', priority: 'medium' as const },
          { id: '3', title: 'Follow-up: Design Co', icon: '🔗', priority: 'low' as const }
        ],
        interviewPipeline: [
          { id: '1', title: 'TechCorp - Technical Round', icon: '💻', priority: 'high' as const, description: 'Tomorrow 2:00 PM', actionUrl: '/opportunities/interview/1' },
          { id: '2', title: 'StartupXYZ - Cultural Fit', icon: '🤝', priority: 'medium' as const, description: 'Next week', actionUrl: '/opportunities/interview/2' },
          { id: '3', title: 'Design Co - Portfolio Review', icon: '🎨', priority: 'low' as const, description: 'Pending schedule', actionUrl: '/opportunities/interview/3' }
        ]
      };
    }

    // Default content
    return {
      profileHealth: 85,
      todos: [
        { id: '1', title: 'Complete profile setup', icon: '👤', priority: 'high' as const },
        { id: '2', title: 'Explore trending skills', icon: '📈', priority: 'medium' as const },
        { id: '3', title: 'Browse opportunities', icon: '🎯', priority: 'low' as const }
      ],
      stats: [
        { id: '1', title: 'Profile completeness', icon: '📊', priority: 'low' as const, value: '85%' },
        { id: '2', title: 'Skill assessments', icon: '🧪', priority: 'low' as const, value: '3' },
        { id: '3', title: 'Weekly progress', icon: '📈', priority: 'low' as const, value: '+12%' }
      ]
    };
  };

  const getIconFromString = (iconString: string) => {
    // Map emoji/string icons to React components
    switch (iconString) {
      case '📊': return <TrendingUp className="w-4 h-4" />;
      case '🚨': return <AlertCircle className="w-4 h-4" />;
      case '👁️': return <Eye className="w-4 h-4" />;
      case '🎯': return <Target className="w-4 h-4" />;
      case '🚀': return <Zap className="w-4 h-4" />;
      case '🧠': return <Brain className="w-4 h-4" />;
      case '📅': return <Calendar className="w-4 h-4" />;
      case '📈': return <TrendingUp className="w-4 h-4" />;
      case '📄': return <MessageSquare className="w-4 h-4" />;
      case '🎭': return <Users className="w-4 h-4" />;
      case '⏳': return <Clock className="w-4 h-4" />;
      case '⚡': return <Zap className="w-4 h-4" />;
      case '🔧': return <Star className="w-4 h-4" />;
      case '💡': return <Lightbulb className="w-4 h-4" />;
      case '⚠️': return <AlertCircle className="w-4 h-4" />;
      case '✅': return <CheckCircle className="w-4 h-4" />;
      case '🔥': return <TrendingUp className="w-4 h-4" />;
      case '📚': return <Brain className="w-4 h-4" />;
      case '💼': return <Briefcase className="w-4 h-4" />;
      case '🏆': return <Trophy className="w-4 h-4" />;
      case '👤': return <Users className="w-4 h-4" />;
      case '📧': return <Mail className="w-4 h-4" />;
      case '🔒': return <Shield className="w-4 h-4" />;
      case '🧪': return <Award className="w-4 h-4" />;
      case '📋': return <MessageSquare className="w-4 h-4" />;
      case '🔗': return <Star className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const renderActionItem = (item: ContextualAction) => {
    const handleClick = () => {
      if (item.action) {
        item.action();
      } else if (item.actionUrl) {
        router.push(item.actionUrl);
      }
    };

    const content = (
      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
        <div className={cn("flex-shrink-0 mt-0.5 relative", getPriorityColor(item.priority))}>
          {getIconFromString(item.icon)}
          {item.decay && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
          {item.trending && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
          {item.description && (
            <p className="text-xs text-gray-500 mt-0.5 break-words">{item.description}</p>
          )}
          {item.progress !== undefined && (
            <Progress value={item.progress} className="h-1 mt-2" />
          )}
        </div>
        {item.value !== undefined && (
          <div className="flex-shrink-0">
            <Badge variant="secondary" className="text-xs">
              {item.value}
            </Badge>
          </div>
        )}
        {(item.action || item.actionUrl) && (
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </div>
    );

    return (item.action || item.actionUrl) ? (
      <button
        key={item.id}
        onClick={handleClick}
        className="w-full text-left"
      >
        {content}
      </button>
    ) : (
      <div key={item.id}>{content}</div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-gray-200 z-50 transition-all duration-200",
        "w-[280px] min-w-[280px] max-w-[280px] flex-shrink-0",
        isMobile ? "fixed left-0 top-0 h-screen" : "sticky top-16 h-[calc(100vh-4rem)]",
        isMobile && (isOpen ? "translate-x-0" : "-translate-x-full"),
        !isMobile && (isOpen ? "block" : "hidden")
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md text-gray-800 font-semibold">Welcome back, {userName}</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">Profile Health</h2>
                  <span className="text-xl">
                    {contextualData.profileHealth <= 30 ? '😞' : 
                     contextualData.profileHealth <= 60 ? '🙂' : 
                     contextualData.profileHealth <= 95 ? '😊' : '🤩'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Progress value={contextualData.profileHealth} className="h-2 w-28" />
                  <span className="text-sm font-medium text-gray-700">
                    {contextualData.profileHealth}%
                  </span>
                </div>
              </div>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="lg:hidden"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-4">

              {/* Early Access Member Section */}
              <div className="bg-green-500 rounded-lg p-4 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-semibold">Early Access Member</span>
                </div>
                <p className="text-xs mb-1">You're helping us build SkillGlobe</p>
              </div>

              {/* Boost Your Chances Section */}
              <div 
                className="relative"
                onMouseEnter={() => setIsBoostHovered(true)}
                onMouseLeave={() => setIsBoostHovered(false)}
              >
                <div className="flex items-center space-x-2 mb-3 mt-8">
                  <Star className="w-4 h-4 text-pink-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Boost Your Chances</h3>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">Coming Soon</span>
                  </div>
                </div>

                {!isBoostHovered ? (
                  /* Coming Soon State */
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-md">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Section Coming Soon</h4>
                      <p className="text-xs text-gray-600 mb-3">
                        Enhance your profile visibility with personalized recommendations
                      </p>
                      <div className="bg-white/60 rounded-lg p-2 border border-white/40">
                        <p className="text-xs text-gray-700">
                          <span className="font-medium">Hover to preview</span> upcoming features
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Hover State - Show All Items */
                  <div className="space-y-3 animate-in fade-in duration-200">
                    {/* Verify Email Card */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Verify Email</h4>
                          <p className="text-xs text-blue-600 mt-0.5">Unlock direct messaging</p>
                          <p className="text-xs text-gray-500 mt-0.5">Takes 30 seconds →</p>
                        </div>
                      </div>
                    </div>

                    {/* Add TypeScript Skill Card */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-yellow-200 hover:bg-yellow-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Add TypeScript skill</h4>
                          <p className="text-xs text-blue-600 mt-0.5">+9 new matches waiting</p>
                          <p className="text-xs text-gray-500 mt-0.5">Add now →</p>
                        </div>
                      </div>
                    </div>

                    {/* Upload Resume Card */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Upload className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Upload resume</h4>
                          <p className="text-xs text-blue-600 mt-0.5">Auto-fill applications</p>
                          <p className="text-xs text-gray-500 mt-0.5">Upload →</p>
                        </div>
                      </div>
                    </div>

                    {/* Complete Profile Card */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-green-200 hover:bg-green-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Complete profile</h4>
                          <p className="text-xs text-blue-600 mt-0.5">Increase visibility</p>
                          <p className="text-xs text-gray-500 mt-0.5">Complete →</p>
                        </div>
                      </div>
                    </div>

                    {/* Add Experience Card */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Add experience</h4>
                          <p className="text-xs text-blue-600 mt-0.5">Show your expertise</p>
                          <p className="text-xs text-gray-500 mt-0.5">Add now →</p>
                        </div>
                      </div>
                    </div>

                    {/* Take Assessment Card */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Award className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Take skill assessment</h4>
                          <p className="text-xs text-blue-600 mt-0.5">Verify your skills</p>
                          <p className="text-xs text-gray-500 mt-0.5">Start test →</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}