'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, X, Star, Trash2 } from 'lucide-react';
import SkillsSuccessModal from '../modal/SkillsSuccessModal';
import { useAddSkillsStore } from '@/store/individual-skill/addskillsStore';
import { toast } from 'react-hot-toast';
import { SkillData as ApiSkillData, getSkillsByCategory, getAuthData } from '@/app/api/Individual Skills/addSkills';

interface SkillsProps {
  onSkillsComplete?: () => void;
  onSkip?: () => void;
  className?: string;
}

interface SkillData {
  id?: string; // API id for existing skills (needed for deletion)
  name: string;
  category: string;
}

// We'll fetch skill categories from API instead of hardcoding them

export default function Skills({ onSkillsComplete, onSkip, className = '' }: SkillsProps) {
  const [selectedSkills, setSelectedSkills] = useState<SkillData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [searchResults, setSearchResults] = useState<{name: string, category: string}[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [skillCategories, setSkillCategories] = useState<{[key: string]: string[]}>({});
  const [initialSkills, setInitialSkills] = useState<SkillData[]>([]);


  // Get the store functions
  const { 
    addSkills, 
    isSubmitting, 
    submitError, 
    fetchSkillsList, 
    skillsList, 
    isFetchingList, 
    fetchListError,
    deleteSkill,
    isDeleting,
    deleteError
  } = useAddSkillsStore();

  // Fetch skills by category on component mount
  useEffect(() => {
    const loadSkillCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        setCategoriesError(null);
        
        // Get auth data
        const authData = getAuthData();
        if (!authData) {
          throw new Error('Authentication data not found');
        }
        
        // Fetch skills by category from API
        const response = await getSkillsByCategory(authData.apiKey, authData.apiSecret);
        
        if (!response || !response.message || !response.message.data) {
          throw new Error('Invalid API response');
        }
        
        // Get the categories from the API response
        const categoriesData = response.message.data;
        
        // Log the API response for debugging
        console.log('API response categories:', categoriesData);
        
        // Make sure we have all three categories
        const updatedCategories = {
          ...categoriesData,
          // Add missing categories if they don't exist in the API response
          'Technical': categoriesData['Technical'] || [],
          'Tool': categoriesData['Tool'] || [], // Map 'Tool' to 'Tools' if needed
          'Soft Skill': categoriesData['Soft Skill'] || []
        };
        
        console.log('Updated categories:', updatedCategories);
        setSkillCategories(updatedCategories);
        
        // Set the first category as active if available
        const updatedCategoryKeys = Object.keys(updatedCategories);
        if (updatedCategoryKeys.length > 0) {
          // Don't convert to lowercase since we need to match the exact category name
          setActiveCategory('Technical'); // Always start with Technical category
        }
        
        setIsCategoriesLoading(false);
      } catch (error: any) {
        console.error('Error loading skill categories:', error);
        setCategoriesError(error.message || 'Failed to load skill categories');
        setIsCategoriesLoading(false);
      }
    };
    
    loadSkillCategories();
  }, []);
  
  // Fetch user's skills list on component mount
  useEffect(() => {
    const loadSkills = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        // Fetch skills from API
        const skills = await fetchSkillsList();
        
        // Convert API skills to component format and deduplicate
        const uniqueSkills = new Map();
        
        skills.forEach(skill => {
          const key = `${skill.name.toLowerCase()}-${skill.category.toLowerCase()}`;
          if (!uniqueSkills.has(key)) {
            uniqueSkills.set(key, {
              id: skill.id, // Store the API id (name field) for deletion
              name: skill.name,
              category: skill.category
            });
          }
        });
        
        const formattedSkills = Array.from(uniqueSkills.values());
        console.log('Formatted and deduplicated skills:', formattedSkills);
        
        // Set the skills
        setSelectedSkills(formattedSkills);
        setInitialSkills(formattedSkills);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error loading skills:', error);
        setLoadError(error.message || 'Failed to load skills');
        setIsLoading(false);
      }
    };
    
    loadSkills();
  }, [fetchSkillsList]);

  const addSkill = (skill: string, category: string) => {
    console.log(`Adding skill: ${skill} in category: ${category}`);
    // Check for duplicates case-insensitively by both name and category
    if (!selectedSkills.some(s => 
      s.name.toLowerCase() === skill.toLowerCase() && 
      s.category.toLowerCase() === category.toLowerCase()
    )) {
      const newSkill: SkillData = {
        name: skill,
        category
      };
      setSelectedSkills([...selectedSkills, newSkill]);
    } else {
      console.log(`Skill "${skill}" in category "${category}" already exists. Not adding duplicate.`);
    }
  };

  const removeSkill = async (skillName: string, skillId?: string) => {
    // If skillId is provided, it means this is an existing skill from the API that needs to be deleted
    if (skillId) {
      try {
        // Show loading toast
        const loadingToastId = toast.loading('Deleting skill...');
        
        // Call the API to delete the skill
        const success = await deleteSkill(skillId);
        
        // Dismiss loading toast
        toast.dismiss(loadingToastId);
        
        if (success) {
          // Show success toast
          toast.success('Skill deleted successfully');
          
          // Remove from local state
          setSelectedSkills(selectedSkills.filter(s => s.name !== skillName));
        } else {
          // Show error toast
          toast.error(deleteError || 'Failed to delete skill');
        }
      } catch (error: any) {
        console.error('Error deleting skill:', error);
        toast.error(error.message || 'An error occurred while deleting the skill');
      }
    } else {
      // Just remove from local state for skills that haven't been saved to API yet
      setSelectedSkills(selectedSkills.filter(s => s.name !== skillName));
    }
  };
  
  // This is now moved to the top of the component

  // Calculate newly added skills (not in initialSkills)
  const newlyAddedSkills = selectedSkills.filter(
    (skill) => !initialSkills.some(
      (s) => s.name.toLowerCase() === skill.name.toLowerCase() && 
             s.category.toLowerCase() === skill.category.toLowerCase()
    )
  );

  const handleContinue = async () => {
    try {
      if (newlyAddedSkills.length === 0) {
        console.log('No new skills to submit.');
        return;
      }
      
      console.log('Submitting only newly added skills:', newlyAddedSkills);
  
      const apiSkills: ApiSkillData[] = newlyAddedSkills.map(skill => ({
        skills: skill.name,
        type_of_skills: skill.category
      }));
  
      const success = await addSkills(apiSkills);
  
      if (success) {
        // Update initialSkills to include the newly added skills
        setInitialSkills([...initialSkills, ...newlyAddedSkills]);
        setShowSuccessModal(true);
      } else {
        console.error('Failed to add skills:', submitError);
        toast.error(submitError || 'Failed to add skills');
      }
    } catch (error: any) {
      console.error('Error adding skills:', error);
      toast.error(error.message || 'An error occurred while adding skills');
    }
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
    if (searchQuery.trim() === '' || isCategoriesLoading) {
      setSearchResults([]);
      return;
    }
    
    const results: {name: string, category: string}[] = [];
    
    // Log the categories and skills for debugging
    console.log('Search query:', searchQuery);
    console.log('Skill categories:', skillCategories);
    
    Object.entries(skillCategories).forEach(([category, skills]) => {
      // Make sure skills is an array
      if (Array.isArray(skills)) {
        const matchingSkills = skills.filter(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        console.log(`Category ${category} has ${matchingSkills.length} matching skills`);
        
        matchingSkills.forEach(skill => {
          results.push({ name: skill, category: category });
        });
      }
    });
    
    console.log('Search results:', results);
    setSearchResults(results);
  }, [searchQuery, isCategoriesLoading, skillCategories]);
  
  // Get skills for the active category - use case-insensitive comparison
  const categorySkills = selectedSkills.filter(skill => 
    skill.category.toLowerCase() === activeCategory.toLowerCase()
  );


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

      {/* Selected Skills */}
      {/* {selectedSkills.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Selected Skills ({selectedSkills.length})</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <div
                key={`${skill.category}-${skill.name}`}
                className="flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-lg"
              >
                <span className="text-sm font-medium">{skill.name}</span>
                <button
                  onClick={() => removeSkill(skill.name, skill.id)}
                  className="text-orange-600 hover:text-orange-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-sm p-1"
                  aria-label={`Remove ${skill.name} skill`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )} */}

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
        {isCategoriesLoading ? (
          <div className="flex items-center text-gray-500 px-4 py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            Loading categories...
          </div>
        ) : categoriesError ? (
          <div className="text-red-500 px-4 py-2">Error: {categoriesError}</div>
        ) : Object.keys(skillCategories).length === 0 ? (
          <div className="text-gray-500 px-4 py-2">No skill categories available</div>
        ) : (
          ["Technical", "Tool", "Soft Skill"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))
        )}
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
                        <div className="text-xs text-gray-500 mt-1">{result.category}</div>
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
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Loading skills...</span>
          </div>
        ) : loadError ? (
          <div className="text-red-500 text-center py-4">
            <p>Error loading skills: {loadError}</p>
            <button 
              onClick={() => fetchSkillsList()}
              className="mt-2 text-blue-500 underline"
            >
              Try again
            </button>
          </div>
        ) : categorySkills.length > 0 ? (
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
                    onClick={() => removeSkill(skill.name, skill.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label={`Remove ${skill.name}`}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-t-transparent border-red-500 rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 size={18} />
                    )}
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
          disabled={selectedSkills.length === 0 || isSubmitting || isLoading}
          className="max-w-xs mx-auto flex-1 bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : isSubmitting ? 'Saving...' : `Continue with ${newlyAddedSkills.length} skill${newlyAddedSkills.length !== 1 ? 's' : ''}`}
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
