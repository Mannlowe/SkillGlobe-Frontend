'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, X, Star, Trash2 } from 'lucide-react';
import SkillsSuccessModal from '../modal/SkillsSuccessModal';

interface SkillsProps {
  onSkillsComplete?: () => void;
  onSkip?: () => void;
  className?: string;
}

interface SkillData {
  name: string;
  category: string;
}

const skillCategories = {
  technical: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git'],
  tools: ['Figma', 'Photoshop', 'Excel', 'Salesforce', 'Jira', 'Slack', 'Notion', 'Tableau'],
  soft: ['Leadership', 'Communication', 'Problem Solving', 'Time Management', 'Teamwork', 'Creativity']
};

export default function Skills({ onSkillsComplete, onSkip, className = '' }: SkillsProps) {
  const [selectedSkills, setSelectedSkills] = useState<SkillData[]>([]);
  const [skillsLoaded, setSkillsLoaded] = useState(false);  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('technical');
  const [searchResults, setSearchResults] = useState<{name: string, category: string}[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load skills from localStorage on component mount
  useEffect(() => {
    const savedSkills = localStorage.getItem('selectedSkills');
    if (savedSkills) {
      try {
        const parsedSkills = JSON.parse(savedSkills);
        setSelectedSkills(parsedSkills);
      } catch (error) {
        console.error('Error parsing saved skills:', error);
        localStorage.removeItem('selectedSkills'); // Clear invalid data
      }
    }
    setSkillsLoaded(true);
  }, []);

  // Save skills to localStorage whenever they change
  useEffect(() => {
    if (skillsLoaded) {
    localStorage.setItem('selectedSkills', JSON.stringify(selectedSkills));
    }
  }, [selectedSkills, skillsLoaded]);

  const addSkill = (skill: string, category: string) => {
    if (!selectedSkills.some(s => s.name === skill)) {
      const newSkill: SkillData = {
        name: skill,
        category
      };
      setSelectedSkills([...selectedSkills, newSkill]);
    }
  };

  const removeSkill = (skillName: string) => {
    setSelectedSkills(selectedSkills.filter(s => s.name !== skillName));
  };
  
  // Rating functionality removed as requested

  const handleContinue = () => {
    setShowSuccessModal(true);
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Removed onSkillsComplete call to prevent redirection
  };
  
  // Separate function for when user wants to continue after viewing modal
  const handleContinueAfterModal = () => {
    setShowSuccessModal(false);
    if (onSkillsComplete) {
      onSkillsComplete();
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  // Update search results when query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const results: {name: string, category: string}[] = [];
    
    Object.entries(skillCategories).forEach(([category, skills]) => {
      const matchingSkills = skills.filter(skill => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      matchingSkills.forEach(skill => {
        results.push({ name: skill, category });
      });
    });
    
    setSearchResults(results);
  }, [searchQuery]);
  
  // Get skills for the active category
  const categorySkills = selectedSkills.filter(skill => skill.category === activeCategory);

  return (
    <div className={`bg-white rounded-xl shadow-sm p-3 space-y-6 w-full font-rubik ${className}`}>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          What are you good at?
        </h1>
        <p className="text-gray-600">
          Help us match you with the right opportunities by selecting your skills
        </p>
      </div>



      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          placeholder="Search for skills..."
        />
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2">
        {Object.keys(skillCategories).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === category
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Search Results */}
      {searchQuery.trim() !== '' && (
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">
            Search Results
          </h3>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {searchResults.map((result) => {
                const isSelected = selectedSkills.some(s => s.name === result.name);
                return (
                  <button
                    key={`${result.category}-${result.name}`}
                    onClick={() => isSelected ? removeSkill(result.name) : addSkill(result.name, result.category)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{result.name}</span>
                        <div className="text-xs text-gray-500 mt-1">{result.category.charAt(0).toUpperCase() + result.category.slice(1)}</div>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <X className="text-white" size={12} />
                        </div>
                      ) : (
                        <Plus className="text-gray-400" size={16} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No skills found matching your search</p>
          )}
        </div>
      )}

      {/* Technical Skills */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">
          {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Skills
        </h3>
        {categorySkills.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {categorySkills.map((skill) => (
              <div 
                key={skill.name} 
                className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex items-center">
                  <span className="text-sm font-medium text-blue-800">{skill.name}</span>
                </div>
                
                <div className="flex items-center">
                  {/* Delete Button */}
                  <button
                    onClick={() => removeSkill(skill.name)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label={`Remove ${skill.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            {searchQuery ? "Search for skills to add them here" : "No skills added in this category yet"}
          </p>
        )}
      </div>

      {/* Skill Tips */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <div className="flex items-start space-x-3">
          <Star className="text-blue-600 mt-0.5" size={16} />
          <div className="text-sm">
            <p className="text-blue-900 font-medium mb-1">Pro Tip</p>
            <p className="text-blue-700">
              Select 5-10 skills that best represent your expertise. You can always add more later in your profile.
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        {/* <button
          onClick={handleSkip}
          className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
        >
          Skip for Now
        </button> */}
        <button
          onClick={handleContinue}
          disabled={selectedSkills.length === 0}
          className="max-w-xs mx-auto flex-1 bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue with {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''}
        </button>
      </div>

      {/* Success Modal */}
      <SkillsSuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleModalClose} 
        skillCount={selectedSkills.length} 
      />
    </div>
  );
}
