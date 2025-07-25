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
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useVerification } from '@/contexts/VerificationContext';

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
    profileHealth: 85,
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

  const getContextualContent = (path: string) => {
    if (path.includes('dashboard')) {
      return {
        profileHealth: 85,
        todos: [
          { id: '1', title: 'Complete email verification', icon: '📧', priority: 'high' as const, actionUrl: '/verification?step=email' },
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
                <h2 className="text-lg font-semibold text-gray-900">Profile Health</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Progress value={contextualData.profileHealth} className="h-2 w-24" />
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

          {/* Verification Status Section */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-orange-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Verification Status</h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {getVerificationScore()}%
                </Badge>
              </div>
              
              <div className="space-y-2">
                {/* Next Verification Step */}
                {(() => {
                  const nextStep = getNextVerificationStep();
                  if (nextStep) {
                    return (
                      <button
                        onClick={() => {
                          if (nextStep.type === 'email') router.push('/verification?step=email');
                          else if (nextStep.type === 'phone') router.push('/verification?step=phone');
                          else if (nextStep.type === 'identity') router.push('/verification');
                          else if (nextStep.type === 'skills') router.push('/skills');
                        }}
                        className="w-full flex items-center space-x-2 p-2 rounded-lg bg-white border border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                      >
                        <div className={cn(
                          "w-2 h-2 rounded-full animate-pulse",
                          nextStep.priority === 'high' ? 'bg-red-500' : 
                          nextStep.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                        )} />
                        <span className="text-xs text-gray-700 flex-1 text-left">{nextStep.message}</span>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                      </button>
                    );
                  }
                  return (
                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-700">All verifications complete!</span>
                    </div>
                  );
                })()}

                {/* Verification Status Icons */}
                <div className="grid grid-cols-6 gap-1">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    verificationStatus.email.verified ? 'bg-green-100' : 'bg-gray-100'
                  )}>
                    <Mail className={cn(
                      "w-3 h-3",
                      verificationStatus.email.verified ? 'text-green-600' : 'text-gray-400'
                    )} />
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    verificationStatus.phone.verified ? 'bg-green-100' : 'bg-gray-100'
                  )}>
                    <Phone className={cn(
                      "w-3 h-3",
                      verificationStatus.phone.verified ? 'text-green-600' : 'text-gray-400'
                    )} />
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    verificationStatus.identity.verified ? 'bg-green-100' : 'bg-gray-100'
                  )}>
                    <Shield className={cn(
                      "w-3 h-3",
                      verificationStatus.identity.verified ? 'text-green-600' : 'text-gray-400'
                    )} />
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    verificationStatus.skills.verified > 0 ? 'bg-green-100' : 'bg-gray-100'
                  )}>
                    <Award className={cn(
                      "w-3 h-3",
                      verificationStatus.skills.verified > 0 ? 'text-green-600' : 'text-gray-400'
                    )} />
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    verificationStatus.education.verified ? 'bg-green-100' : 'bg-gray-100'
                  )}>
                    <GraduationCap className={cn(
                      "w-3 h-3",
                      verificationStatus.education.verified ? 'text-green-600' : 'text-gray-400'
                    )} />
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    verificationStatus.employment.verified ? 'bg-green-100' : 'bg-gray-100'
                  )}>
                    <Briefcase className={cn(
                      "w-3 h-3",
                      verificationStatus.employment.verified ? 'text-green-600' : 'text-gray-400'
                    )} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 px-4 py-4 overflow-hidden">
            {contextualData.loading ? (
              <div className="space-y-6">
                {/* Loading skeleton */}
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-2 bg-gray-200 rounded animate-pulse w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
            <div className="space-y-6 w-full">
              {/* To-dos */}
              {contextualData.todos.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Profile To-dos
                  </h3>
                  <div className="space-y-1">
                    {contextualData.todos.map(renderActionItem)}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              {contextualData.stats.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Quick Stats
                  </h3>
                  <div className="space-y-1">
                    {contextualData.stats.map(renderActionItem)}
                  </div>
                </div>
              )}

              {/* Smart Actions */}
              {contextualData.smartActions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Smart Actions
                  </h3>
                  <div className="space-y-1">
                    {contextualData.smartActions.map(renderActionItem)}
                  </div>
                </div>
              )}

              {/* Opportunities */}
              {contextualData.opportunities.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Opportunities
                  </h3>
                  <div className="space-y-1">
                    {contextualData.opportunities.map(renderActionItem)}
                  </div>
                </div>
              )}

              {/* Skill Alerts */}
              {contextualData.skillAlerts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span>Skill Alerts</span>
                    <span className="ml-2 text-red-600 text-xs">⚠️</span>
                  </h3>
                  <div className="space-y-1">
                    {contextualData.skillAlerts.map(renderActionItem)}
                  </div>
                </div>
              )}

              {/* Trending Skills */}
              {contextualData.trendingSkills.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span>Trending Skills</span>
                    <span className="ml-2 text-green-600 text-xs">🔥</span>
                  </h3>
                  <div className="space-y-1">
                    {contextualData.trendingSkills.map(renderActionItem)}
                  </div>
                </div>
              )}

              {/* Interview Pipeline */}
              {contextualData.interviewPipeline.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span>Interview Pipeline</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {contextualData.interviewPipeline.length}
                    </Badge>
                  </h3>
                  <div className="space-y-1">
                    {contextualData.interviewPipeline.map(renderActionItem)}
                  </div>
                </div>
              )}
            </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/insights')}
            >
              View All Insights
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}