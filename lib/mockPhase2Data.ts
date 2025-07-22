import type { SavedSearch, ApplicationRecord, ConversationThread } from '@/types/opportunities';

export const mockSavedSearches: SavedSearch[] = [
  {
    id: 'search-1',
    name: 'React Developer Remote',
    filters: {
      keywords: ['React', 'JavaScript', 'TypeScript'],
      location: { remote_only: true },
      salary_range: [80000, 120000],
      job_type: [],
      experience_level: [],
      remote_options: [],
      company_size: [],
      industry: [],
      posted_within: { id: '1w', label: 'Last week', value: '1w', days: 7 },
      match_score_min: 75
    },
    created_at: '2025-01-15',
    last_run: '2025-01-21',
    new_results_count: 5,
    alert_enabled: true,
    alert_frequency: 'daily'
  },
  {
    id: 'search-2',
    name: 'Senior Frontend SF',
    filters: {
      keywords: ['Frontend', 'Senior'],
      location: { city: 'San Francisco', state: 'CA' },
      salary_range: [100000, 150000],
      job_type: [],
      experience_level: [],
      remote_options: [],
      company_size: [],
      industry: [],
      posted_within: { id: '3d', label: 'Last 3 days', value: '3d', days: 3 },
      match_score_min: 80
    },
    created_at: '2025-01-10',
    last_run: '2025-01-21',
    new_results_count: 2,
    alert_enabled: false,
    alert_frequency: 'weekly'
  }
];

export const mockApplications: ApplicationRecord[] = [
  {
    id: 'app-1',
    job_opportunity_id: 'job-001',
    job_title: 'Senior React Developer',
    company_name: 'TechCorp Solutions',
    applied_date: '2025-01-18',
    status: {
      current: 'under_review',
      updated_at: '2025-01-19',
      updated_by: 'system'
    },
    stage: {
      current: 'phone_screen',
      stages_completed: ['applied'],
      next_stage: 'technical_interview',
      estimated_timeline: '3-5 days'
    },
    last_update: '2 days ago',
    next_action: 'Prepare for phone screen on Jan 24',
    notes: 'Great company culture, competitive salary range',
    documents: [
      {
        id: 'doc-1',
        type: 'resume',
        name: 'Resume_John_Doe_2025.pdf',
        url: '/documents/resume.pdf',
        uploaded_at: '2025-01-18',
        file_size: 245760
      },
      {
        id: 'doc-2',
        type: 'cover_letter',
        name: 'Cover_Letter_TechCorp.pdf',
        url: '/documents/cover.pdf',
        uploaded_at: '2025-01-18',
        file_size: 156432
      }
    ],
    communication_history: [
      {
        id: 'comm-1',
        type: 'email',
        direction: 'inbound',
        from: 'sarah.recruiter@techcorp.com',
        to: 'john.doe@email.com',
        subject: 'Phone Screen Scheduled - Senior React Developer',
        content: 'Hi John, Thanks for your application. I\'d like to schedule a phone screen...',
        timestamp: '2025-01-19T10:30:00Z'
      }
    ]
  },
  {
    id: 'app-2',
    job_opportunity_id: 'job-002',
    job_title: 'Full Stack Engineer',
    company_name: 'StartupXYZ',
    applied_date: '2025-01-15',
    status: {
      current: 'interview',
      updated_at: '2025-01-20',
      updated_by: 'employer'
    },
    stage: {
      current: 'technical_interview',
      stages_completed: ['applied', 'phone_screen'],
      next_stage: 'final_interview',
      estimated_timeline: '1-2 weeks'
    },
    last_update: '1 day ago',
    next_action: 'Technical interview tomorrow at 2 PM',
    notes: 'Fast-growing startup, equity opportunity',
    documents: [
      {
        id: 'doc-3',
        type: 'resume',
        name: 'Resume_John_Doe_2025.pdf',
        url: '/documents/resume.pdf',
        uploaded_at: '2025-01-15',
        file_size: 245760
      }
    ],
    communication_history: [
      {
        id: 'comm-2',
        type: 'email',
        direction: 'outbound',
        from: 'john.doe@email.com',
        to: 'mike@startupxyz.com',
        subject: 'Re: Technical Interview Confirmation',
        content: 'Thank you for scheduling the technical interview. I\'m looking forward to it.',
        timestamp: '2025-01-20T14:15:00Z'
      }
    ]
  },
  {
    id: 'app-3',
    job_opportunity_id: 'job-003',
    job_title: 'Frontend Architect',
    company_name: 'Enterprise Corp',
    applied_date: '2025-01-12',
    status: {
      current: 'offer',
      updated_at: '2025-01-21',
      updated_by: 'employer'
    },
    stage: {
      current: 'offer_negotiation',
      stages_completed: ['applied', 'phone_screen', 'technical_interview', 'final_interview'],
      estimated_timeline: '2-3 days'
    },
    last_update: 'Today',
    next_action: 'Review offer details and respond by Jan 25',
    notes: 'Received competitive offer, considering negotiation',
    documents: [
      {
        id: 'doc-4',
        type: 'resume',
        name: 'Resume_John_Doe_2025.pdf',
        url: '/documents/resume.pdf',
        uploaded_at: '2025-01-12',
        file_size: 245760
      },
      {
        id: 'doc-5',
        type: 'other',
        name: 'Portfolio_Examples.pdf',
        url: '/documents/portfolio.pdf',
        uploaded_at: '2025-01-12',
        file_size: 1024000
      }
    ],
    communication_history: [
      {
        id: 'comm-3',
        type: 'email',
        direction: 'inbound',
        from: 'hr@enterprisecorp.com',
        to: 'john.doe@email.com',
        subject: 'Job Offer - Frontend Architect Position',
        content: 'Congratulations! We are pleased to extend an offer for the Frontend Architect position...',
        timestamp: '2025-01-21T09:00:00Z'
      }
    ]
  },
  {
    id: 'app-4',
    job_opportunity_id: 'job-004',
    job_title: 'React Native Developer',
    company_name: 'Mobile First Inc',
    applied_date: '2025-01-20',
    status: {
      current: 'submitted',
      updated_at: '2025-01-20',
      updated_by: 'user'
    },
    stage: {
      current: 'applied',
      stages_completed: [],
      next_stage: 'phone_screen',
      estimated_timeline: '5-7 days'
    },
    last_update: '1 day ago',
    next_action: 'Wait for initial response',
    notes: 'Interesting mobile-first company, good growth potential',
    documents: [
      {
        id: 'doc-6',
        type: 'resume',
        name: 'Resume_John_Doe_2025.pdf',
        url: '/documents/resume.pdf',
        uploaded_at: '2025-01-20',
        file_size: 245760
      }
    ],
    communication_history: []
  }
];

export const mockConversations: ConversationThread[] = [
  {
    id: 'conv-1',
    participant: {
      name: 'Sarah Mitchell',
      company: 'TechCorp Solutions',
      avatar: '/avatars/sarah.jpg',
      role: 'Senior Technical Recruiter',
      status: 'online'
    },
    messages: [
      {
        id: 'msg-1',
        sender: 'other',
        content: 'Hi John! Thank you for applying to our Senior React Developer position. Your background looks impressive. I\'d love to schedule a phone screen to discuss the role further.',
        timestamp: '2025-01-19T10:30:00Z'
      },
      {
        id: 'msg-2',
        sender: 'self',
        content: 'Thank you Sarah! I\'m very interested in the position. I\'m available for a phone screen this week. What times work best for you?',
        timestamp: '2025-01-19T14:15:00Z'
      },
      {
        id: 'msg-3',
        sender: 'other',
        content: 'Great! How about Wednesday at 2 PM PST? I\'ll send you a calendar invite with the details.',
        timestamp: '2025-01-19T14:45:00Z'
      },
      {
        id: 'msg-4',
        sender: 'self',
        content: 'Wednesday at 2 PM works perfectly. Looking forward to our conversation!',
        timestamp: '2025-01-19T15:00:00Z'
      }
    ],
    lastMessage: {
      content: 'Wednesday at 2 PM works perfectly. Looking forward to our conversation!',
      timestamp: '2025-01-19T15:00:00Z',
      sender: 'self'
    },
    unreadCount: 0,
    type: 'job_inquiry'
  },
  {
    id: 'conv-2',
    participant: {
      name: 'Mike Chen',
      company: 'StartupXYZ',
      avatar: '/avatars/mike.jpg',
      role: 'Engineering Manager',
      status: 'busy'
    },
    messages: [
      {
        id: 'msg-5',
        sender: 'other',
        content: 'Hi John, thanks for the great phone screen yesterday. The team was impressed and we\'d like to move forward with a technical interview.',
        timestamp: '2025-01-20T09:00:00Z'
      },
      {
        id: 'msg-6',
        sender: 'self',
        content: 'That\'s fantastic news! I really enjoyed our conversation as well. When would be good for the technical interview?',
        timestamp: '2025-01-20T09:30:00Z'
      },
      {
        id: 'msg-7',
        sender: 'other',
        content: 'How about tomorrow (Tuesday) at 2 PM? It will be a 90-minute session with two of our senior engineers. We\'ll focus on React, Node.js, and system design.',
        timestamp: '2025-01-20T10:00:00Z'
      }
    ],
    lastMessage: {
      content: 'How about tomorrow (Tuesday) at 2 PM? It will be a 90-minute session with two of our senior engineers.',
      timestamp: '2025-01-20T10:00:00Z',
      sender: 'other'
    },
    unreadCount: 1,
    type: 'interview'
  },
  {
    id: 'conv-3',
    participant: {
      name: 'Lisa Rodriguez',
      company: 'Enterprise Corp',
      avatar: '/avatars/lisa.jpg',
      role: 'HR Business Partner',
      status: 'offline'
    },
    messages: [
      {
        id: 'msg-8',
        sender: 'other',
        content: 'Congratulations John! We are excited to extend you an offer for the Frontend Architect position. Please find the offer details attached.',
        timestamp: '2025-01-21T09:00:00Z'
      }
    ],
    lastMessage: {
      content: 'Congratulations John! We are excited to extend you an offer for the Frontend Architect position.',
      timestamp: '2025-01-21T09:00:00Z',
      sender: 'other'
    },
    unreadCount: 1,
    type: 'offer'
  },
  {
    id: 'conv-4',
    participant: {
      name: 'David Park',
      company: 'Design Studio',
      avatar: '/avatars/david.jpg',
      role: 'Lead Designer',
      status: 'online'
    },
    messages: [
      {
        id: 'msg-9',
        sender: 'other',
        content: 'Hey John! I came across your profile and was impressed by your React work. We have some exciting projects coming up that might be a good fit.',
        timestamp: '2025-01-21T11:00:00Z'
      }
    ],
    lastMessage: {
      content: 'Hey John! I came across your profile and was impressed by your React work.',
      timestamp: '2025-01-21T11:00:00Z',
      sender: 'other'
    },
    unreadCount: 1,
    type: 'networking'
  }
];