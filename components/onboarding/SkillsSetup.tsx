'use client';

import { useState } from 'react';
import { Search, Plus, X, Star } from 'lucide-react';

interface SkillsSetupProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

const skillCategories = {
  technical: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Git'],
  tools: ['Figma', 'Photoshop', 'Excel', 'Salesforce', 'Jira', 'Slack', 'Notion', 'Tableau'],
  soft: ['Leadership', 'Communication', 'Problem Solving', 'Time Management', 'Teamwork', 'Creativity']
};

export default function SkillsSetup({ data, updateData, nextStep }: SkillsSetupProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('technical');

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleContinue = () => {
    updateData({ skillsSetup: true, skills: selectedSkills });
    nextStep();
  };

  const filteredSkills = skillCategories[activeCategory as keyof typeof skillCategories].filter(skill =>
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          What are you good at?
        </h1>
        <p className="text-gray-600">
          Help us match you with the right opportunities by selecting your skills
        </p>
      </div>

      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Selected Skills ({selectedSkills.length})</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <div
                key={skill}
                className="flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-lg"
              >
                <span className="text-sm font-medium">{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-orange-600 hover:text-orange-800"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
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

      {/* Skills Grid */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">
          {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Skills
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {filteredSkills.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => isSelected ? removeSkill(skill) : addSkill(skill)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-25'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{skill}</span>
                  {isSelected ? (
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
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

      <button
        onClick={handleContinue}
        disabled={selectedSkills.length === 0}
        className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue with {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''}
      </button>
    </div>
  );
}