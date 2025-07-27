import {
  UserProfile,
  MatchingResult,
  ProfileMatch,
  SkillMatchAnalysis,
  ExperienceMatchAnalysis,
  PreferenceMatchAnalysis,
  GapAnalysis,
  MatchReasoning,
  MatchedSkill,
  SkillLevel
} from '@/types/multi-profile';

// Job Opportunity interface for matching
export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  workType: 'remote' | 'hybrid' | 'onsite';
  jobType: 'full_time' | 'part_time' | 'contract';
  industry: string;
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  salaryRange: [number, number];
  description: string;
  
  // Requirements
  requiredSkills: RequiredSkill[];
  preferredSkills: RequiredSkill[];
  yearsExperienceRequired: number;
  seniorityLevel: 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
  educationRequired?: string;
  certifications?: string[];
  
  // Additional criteria
  urgency: 'low' | 'medium' | 'high';
  postedDate: string;
  applicationDeadline?: string;
  
  // Scoring weights
  skillWeight: number; // 0-1 (typically 0.4)
  experienceWeight: number; // 0-1 (typically 0.3)
  preferencesWeight: number; // 0-1 (typically 0.3)
}

export interface RequiredSkill {
  name: string;
  level: SkillLevel;
  required: boolean; // true for must-have, false for nice-to-have
  weight: number; // importance weight 0-1
}

export class ProfileMatchingEngine {
  
  /**
   * Find the best matching profile for a given opportunity
   */
  findBestProfileMatch(
    opportunity: JobOpportunity, 
    userProfiles: UserProfile[]
  ): MatchingResult {
    // Only consider active profiles
    const activeProfiles = userProfiles.filter(profile => profile.isActive);
    
    if (activeProfiles.length === 0) {
      throw new Error('No active profiles available for matching');
    }

    // Calculate match scores for all profiles
    const profileMatches = activeProfiles.map(profile => 
      this.calculateProfileMatch(opportunity, profile)
    );

    // Sort by match score (highest first)
    profileMatches.sort((a, b) => b.matchScore - a.matchScore);

    const bestMatch = profileMatches[0];
    const bestProfile = activeProfiles.find(p => p.id === bestMatch.profileId)!;

    // Generate overall reasoning
    const reasoning = this.generateMatchReasoning(opportunity, bestProfile, bestMatch);

    return {
      opportunityId: opportunity.id,
      bestMatchingProfile: bestProfile,
      matchScore: bestMatch.matchScore,
      profileMatches,
      reasoning
    };
  }

  /**
   * Calculate detailed match analysis for a profile against an opportunity
   */
  private calculateProfileMatch(
    opportunity: JobOpportunity, 
    profile: UserProfile
  ): ProfileMatch {
    const skillMatch = this.analyzeSkillMatch(opportunity, profile);
    const experienceMatch = this.analyzeExperienceMatch(opportunity, profile);
    const preferenceMatch = this.analyzePreferenceMatch(opportunity, profile);
    const gapAnalysis = this.analyzeGaps(opportunity, profile);

    // Calculate weighted overall score
    const overallScore = (
      skillMatch.skillMatchPercentage * opportunity.skillWeight +
      experienceMatch.yearsExperienceMatch * opportunity.experienceWeight +
      this.calculatePreferenceScore(preferenceMatch) * opportunity.preferencesWeight
    );

    return {
      profileId: profile.id,
      profileName: profile.name,
      matchScore: Math.round(overallScore),
      skillMatch,
      experienceMatch,
      preferenceMatch,
      gapAnalysis
    };
  }

  /**
   * Analyze skill compatibility between opportunity and profile
   */
  private analyzeSkillMatch(
    opportunity: JobOpportunity, 
    profile: UserProfile
  ): SkillMatchAnalysis {
    const allRequiredSkills = [...opportunity.requiredSkills, ...opportunity.preferredSkills];
    const allProfileSkills = [...profile.primarySkills, ...profile.secondarySkills];
    
    const matchedSkills: MatchedSkill[] = [];
    const missingCriticalSkills: string[] = [];
    const missingPreferredSkills: string[] = [];
    const overqualifiedSkills: string[] = [];

    // Analyze each required/preferred skill
    allRequiredSkills.forEach(reqSkill => {
      const profileSkill = allProfileSkills.find(
        ps => ps.name.toLowerCase() === reqSkill.name.toLowerCase()
      );

      if (profileSkill) {
        const matchQuality = this.getSkillMatchQuality(profileSkill.level, reqSkill.level);
        
        matchedSkills.push({
          skill: reqSkill.name,
          required: reqSkill.required,
          userLevel: profileSkill.level,
          requiredLevel: reqSkill.level,
          matchQuality
        });

        // Check for overqualification (2+ levels above required)
        if (profileSkill.level >= reqSkill.level + 2) {
          overqualifiedSkills.push(reqSkill.name);
        }
      } else {
        // Missing skill
        if (reqSkill.required) {
          missingCriticalSkills.push(reqSkill.name);
        } else {
          missingPreferredSkills.push(reqSkill.name);
        }
      }
    });

    // Calculate skill match percentage
    const totalRequiredSkills = opportunity.requiredSkills.length;
    const matchedRequiredSkills = matchedSkills.filter(ms => ms.required).length;
    const skillMatchPercentage = totalRequiredSkills > 0 
      ? Math.round((matchedRequiredSkills / totalRequiredSkills) * 100)
      : 100;

    return {
      matchedSkills,
      missingCriticalSkills,
      missingPreferredSkills,
      overqualifiedSkills,
      skillMatchPercentage
    };
  }

  /**
   * Analyze experience compatibility
   */
  private analyzeExperienceMatch(
    opportunity: JobOpportunity, 
    profile: UserProfile
  ): ExperienceMatchAnalysis {
    // Calculate total years of experience
    const totalYearsExperience = profile.relevantExperience.reduce((total, exp) => {
      // Parse duration string (e.g., "2 years 6 months" -> 2.5)
      const years = this.parseDurationToYears(exp.duration);
      return total + years;
    }, 0);

    // Years experience match (100% if meets requirement, scale down if under)
    const yearsExperienceMatch = Math.min(
      100, 
      Math.round((totalYearsExperience / opportunity.yearsExperienceRequired) * 100)
    );

    // Role relevance - check if profile has similar roles
    const relevantRoles = profile.relevantExperience.filter(exp => 
      this.isRoleRelevant(exp.title, opportunity.title, opportunity.seniorityLevel)
    );
    const roleRelevanceScore = relevantRoles.length > 0 
      ? Math.min(100, relevantRoles.length * 25)
      : 0;

    // Industry alignment
    const hasIndustryExperience = profile.relevantExperience.some(exp =>
      profile.jobPreferences.industries.some(industry =>
        industry.toLowerCase() === opportunity.industry.toLowerCase()
      )
    );
    const industryAlignment = hasIndustryExperience ? 100 : 50;

    // Seniority match
    const profileSeniority = this.inferSeniorityLevel(profile);
    const seniorityMatch = this.compareSeniorityLevels(profileSeniority, opportunity.seniorityLevel);

    return {
      yearsExperienceMatch,
      roleRelevanceScore,
      industryAlignment,
      seniorityMatch
    };
  }

  /**
   * Analyze job preference alignment
   */
  private analyzePreferenceMatch(
    opportunity: JobOpportunity, 
    profile: UserProfile
  ): PreferenceMatchAnalysis {
    const prefs = profile.jobPreferences;

    // Salary alignment
    const userMinSalary = prefs.salaryRange[0];
    const userMaxSalary = prefs.salaryRange[1];
    const jobMinSalary = opportunity.salaryRange[0];
    const jobMaxSalary = opportunity.salaryRange[1];
    
    // Check if there's overlap in salary ranges
    const hasOverlap = userMinSalary <= jobMaxSalary && userMaxSalary >= jobMinSalary;
    const salaryAlignment = hasOverlap ? 100 : Math.max(0, 100 - Math.abs(userMinSalary - jobMaxSalary) / 10000);

    // Location/work type match
    const workTypeMatch = prefs.workType.includes(opportunity.workType);
    const locationMatch = opportunity.workType === 'remote' || 
      prefs.locations.some(loc => loc.toLowerCase().includes(opportunity.location.toLowerCase())) ||
      prefs.locations.includes('Remote');

    // Industry preference match
    const industryPreferenceMatch = prefs.industries.some(industry =>
      industry.toLowerCase() === opportunity.industry.toLowerCase()
    ) ? 100 : 0;

    // Company size match
    const companySizeMatch = prefs.companySize.includes(opportunity.companySize);

    return {
      salaryAlignment: Math.round(salaryAlignment),
      locationMatch,
      workTypeMatch,
      industryPreferenceMatch,
      companySizeMatch
    };
  }

  /**
   * Analyze skill and experience gaps
   */
  private analyzeGaps(
    opportunity: JobOpportunity, 
    profile: UserProfile
  ): GapAnalysis {
    const skillGaps: string[] = [];
    const experienceGaps: string[] = [];
    const certificationGaps: string[] = [];
    const improvementSuggestions: string[] = [];

    // Skill gaps (missing critical skills)
    opportunity.requiredSkills.forEach(reqSkill => {
      const hasSkill = [...profile.primarySkills, ...profile.secondarySkills]
        .some(ps => ps.name.toLowerCase() === reqSkill.name.toLowerCase());
      
      if (!hasSkill) {
        skillGaps.push(reqSkill.name);
        improvementSuggestions.push(`Learn ${reqSkill.name} to meet requirements`);
      }
    });

    // Experience gaps
    const totalExperience = profile.relevantExperience.reduce((total, exp) => 
      total + this.parseDurationToYears(exp.duration), 0
    );
    
    if (totalExperience < opportunity.yearsExperienceRequired) {
      const gap = opportunity.yearsExperienceRequired - totalExperience;
      experienceGaps.push(`Need ${gap.toFixed(1)} more years of experience`);
    }

    // Certification gaps
    if (opportunity.certifications) {
      opportunity.certifications.forEach(reqCert => {
        const hasCert = profile.certifications.some(cert =>
          cert.name.toLowerCase().includes(reqCert.toLowerCase())
        );
        
        if (!hasCert) {
          certificationGaps.push(reqCert);
          improvementSuggestions.push(`Get ${reqCert} certification`);
        }
      });
    }

    // Estimate time to qualify
    const totalGaps = skillGaps.length + experienceGaps.length + certificationGaps.length;
    let timeToQualify = "Immediately";
    
    if (totalGaps > 0) {
      if (experienceGaps.length > 0) {
        timeToQualify = "1-2 years";
      } else if (skillGaps.length > 2) {
        timeToQualify = "6-12 months";
      } else if (skillGaps.length > 0 || certificationGaps.length > 0) {
        timeToQualify = "3-6 months";
      }
    }

    return {
      skillGaps,
      experienceGaps,
      certificationGaps,
      timeToQualify,
      improvementSuggestions
    };
  }

  /**
   * Generate human-readable match reasoning
   */
  private generateMatchReasoning(
    opportunity: JobOpportunity,
    profile: UserProfile,
    match: ProfileMatch
  ): MatchReasoning {
    const whyGoodMatch: string[] = [];
    const potentialConcerns: string[] = [];
    const improvementAreas: string[] = [];

    // Analyze strengths
    if (match.skillMatch.skillMatchPercentage >= 80) {
      whyGoodMatch.push(`Strong skill alignment (${match.skillMatch.skillMatchPercentage}% match)`);
    }

    if (match.experienceMatch.yearsExperienceMatch >= 100) {
      whyGoodMatch.push("Meets experience requirements");
    }

    if (match.preferenceMatch.workTypeMatch && match.preferenceMatch.locationMatch) {
      whyGoodMatch.push("Work preferences align perfectly");
    }

    if (match.skillMatch.overqualifiedSkills.length > 0) {
      whyGoodMatch.push(`Brings advanced expertise in ${match.skillMatch.overqualifiedSkills.join(', ')}`);
    }

    // Analyze concerns
    if (match.skillMatch.missingCriticalSkills.length > 0) {
      potentialConcerns.push(`Missing critical skills: ${match.skillMatch.missingCriticalSkills.join(', ')}`);
    }

    if (match.experienceMatch.yearsExperienceMatch < 80) {
      potentialConcerns.push("May need more experience for this role");
    }

    if (!match.preferenceMatch.salaryAlignment) {
      potentialConcerns.push("Salary expectations may not align");
    }

    // Improvement areas
    if (match.gapAnalysis.skillGaps.length > 0) {
      improvementAreas.push(`Develop skills in: ${match.gapAnalysis.skillGaps.join(', ')}`);
    }

    if (match.gapAnalysis.certificationGaps.length > 0) {
      improvementAreas.push(`Consider getting: ${match.gapAnalysis.certificationGaps.join(', ')}`);
    }

    // Overall assessment
    let overallAssessment = "";
    if (match.matchScore >= 85) {
      overallAssessment = "Excellent match - strong candidate for this role";
    } else if (match.matchScore >= 70) {
      overallAssessment = "Good match - worth pursuing with some preparation";
    } else if (match.matchScore >= 50) {
      overallAssessment = "Moderate match - may require significant skill development";
    } else {
      overallAssessment = "Low match - consider other opportunities or extensive preparation";
    }

    return {
      whyGoodMatch,
      potentialConcerns,
      improvementAreas,
      overallAssessment
    };
  }

  // Helper methods

  private getSkillMatchQuality(userLevel: SkillLevel, requiredLevel: SkillLevel): 'perfect' | 'good' | 'adequate' | 'below' {
    const diff = userLevel - requiredLevel;
    if (diff >= 0) return 'perfect';
    if (diff >= -1) return 'good';
    if (diff >= -2) return 'adequate';
    return 'below';
  }

  private parseDurationToYears(duration: string): number {
    // Parse strings like "2 years 6 months", "1.5 years", "18 months"
    const yearMatch = duration.match(/(\d+(?:\.\d+)?)\s*years?/i);
    const monthMatch = duration.match(/(\d+)\s*months?/i);
    
    let years = 0;
    if (yearMatch) years += parseFloat(yearMatch[1]);
    if (monthMatch) years += parseInt(monthMatch[1]) / 12;
    
    return years;
  }

  private isRoleRelevant(profileRole: string, opportunityRole: string, seniorityLevel: string): boolean {
    // Simple keyword matching - could be enhanced with ML
    const profileKeywords = profileRole.toLowerCase().split(/\s+/);
    const opportunityKeywords = opportunityRole.toLowerCase().split(/\s+/);
    
    return profileKeywords.some(keyword => 
      opportunityKeywords.some(oppKeyword => 
        keyword.includes(oppKeyword) || oppKeyword.includes(keyword)
      )
    );
  }

  private inferSeniorityLevel(profile: UserProfile): 'junior' | 'mid' | 'senior' | 'lead' | 'principal' {
    const totalExperience = profile.relevantExperience.reduce((total, exp) => 
      total + this.parseDurationToYears(exp.duration), 0
    );

    if (totalExperience < 2) return 'junior';
    if (totalExperience < 5) return 'mid';
    if (totalExperience < 8) return 'senior';
    if (totalExperience < 12) return 'lead';
    return 'principal';
  }

  private compareSeniorityLevels(profileLevel: string, requiredLevel: string): 'under' | 'match' | 'over' {
    const levels = ['junior', 'mid', 'senior', 'lead', 'principal'];
    const profileIndex = levels.indexOf(profileLevel);
    const requiredIndex = levels.indexOf(requiredLevel);
    
    if (profileIndex < requiredIndex) return 'under';
    if (profileIndex > requiredIndex) return 'over';
    return 'match';
  }

  private calculatePreferenceScore(preferences: PreferenceMatchAnalysis): number {
    let score = 0;
    let factors = 0;

    // Salary (weight: 40%)
    score += preferences.salaryAlignment * 0.4;
    factors += 40;

    // Work type (weight: 25%)
    if (preferences.workTypeMatch) score += 25;
    factors += 25;

    // Location (weight: 20%)
    if (preferences.locationMatch) score += 20;
    factors += 20;

    // Industry (weight: 10%)
    score += preferences.industryPreferenceMatch * 0.1;
    factors += 10;

    // Company size (weight: 5%)
    if (preferences.companySizeMatch) score += 5;
    factors += 5;

    return Math.round(score);
  }
}

// Export singleton instance
export const matchingEngine = new ProfileMatchingEngine();