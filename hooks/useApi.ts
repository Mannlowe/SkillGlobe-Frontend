'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/lib/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useApi<T>(
  apiCall: () => Promise<{ data: T }>,
  options: UseApiOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
      onSuccess?.(response.data);
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      onError?.(errorMessage);
    }
  }, [apiCall, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
    refetch: execute,
  };
}

// Specialized hooks for common API operations

export function useOpportunities(params?: any) {
  return useApi(() => apiService.getOpportunities(params), {
    immediate: true,
  });
}

export function useOpportunityDetails(id: string) {
  return useApi(() => apiService.getOpportunityDetails(id), {
    immediate: !!id,
  });
}

export function useSkills() {
  return useApi(() => apiService.getSkills(), {
    immediate: true,
  });
}

export function usePortfolio() {
  return useApi(() => apiService.getPortfolioItems(), {
    immediate: true,
  });
}

export function useConversations() {
  return useApi(() => apiService.getConversations(), {
    immediate: true,
  });
}

export function useNotifications() {
  return useApi(() => apiService.getNotifications(), {
    immediate: true,
  });
}

export function useDashboardAnalytics() {
  return useApi(() => apiService.getDashboardAnalytics(), {
    immediate: true,
  });
}

export function useVerificationStatus() {
  return useApi(() => apiService.getVerificationStatus(), {
    immediate: true,
  });
}

// Mutation hooks for API operations that modify data
interface UseMutationOptions<T, P> {
  onSuccess?: (data: T, params: P) => void;
  onError?: (error: string, params: P) => void;
}

export function useMutation<T, P = any>(
  apiCall: (params: P) => Promise<{ data: T }>,
  options: UseMutationOptions<T, P> = {}
) {
  const { onSuccess, onError } = options;
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (params: P) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall(params);
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
      onSuccess?.(response.data, params);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      onError?.(errorMessage, params);
      throw error;
    }
  }, [apiCall, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}

// Specialized mutation hooks
export function useCreateSkill() {
  return useMutation(apiService.createSkill);
}

export function useEndorseSkill() {
  return useMutation(apiService.endorseSkill);
}

export function useApplyToOpportunity() {
  return useMutation(({ id, application }: { id: string; application: any }) =>
    apiService.applyToOpportunity(id, application)
  );
}

export function useCreatePortfolioItem() {
  return useMutation(apiService.createPortfolioItem);
}

export function useSendMessage() {
  return useMutation(({ conversationId, message }: { conversationId: string; message: any }) =>
    apiService.sendMessage(conversationId, message)
  );
}

export function useMarkNotificationRead() {
  return useMutation(apiService.markNotificationRead);
}

export function useUploadIdentityDocument() {
  return useMutation(({ file, documentType }: { file: File; documentType: string }) =>
    apiService.uploadIdentityDocument(file, documentType)
  );
}

export function useGlobalSearch() {
  return useMutation(({ query, filters }: { query: string; filters?: any }) =>
    apiService.globalSearch(query, filters)
  );
}

// Combined hooks for complex operations
export function useOpportunityWithActions(id: string) {
  const opportunityQuery = useOpportunityDetails(id);
  const applyMutation = useApplyToOpportunity();

  const apply = useCallback((application: any) => {
    return applyMutation.mutate({ id, application });
  }, [id, applyMutation]);

  return {
    opportunity: opportunityQuery,
    apply,
    applying: applyMutation.loading,
    applyError: applyMutation.error,
  };
}

export function useSkillsWithActions() {
  const skillsQuery = useSkills();
  const createMutation = useCreateSkill();
  const endorseMutation = useEndorseSkill();

  const createSkill = useCallback((skillData: any) => {
    return createMutation.mutate(skillData);
  }, [createMutation]);

  const endorseSkill = useCallback((skillId: string) => {
    return endorseMutation.mutate(skillId);
  }, [endorseMutation]);

  const refetch = useCallback(() => {
    skillsQuery.refetch();
  }, [skillsQuery]);

  return {
    skills: skillsQuery,
    createSkill,
    endorseSkill,
    refetch,
    creating: createMutation.loading,
    endorsing: endorseMutation.loading,
  };
}