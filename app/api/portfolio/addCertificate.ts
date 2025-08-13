import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface for certificate data
export interface CertificateData {
  entity_id: string;
  document_name: string;
  certificate_type: string;
  document_upload: File;
  issuing_organisation?: string;
}

// Interface for add certificate response
export interface AddCertificateResponse {
  message: {
    status: string;
    data?: any;
  };
}

export interface CertificateListResponse {
  message?: {
    status: string;
    message: string;
    data?: {
      portfolio?: string;
      entity_id?: string;
      certificate_list?: Array<{
        name?: string;
        document_name?: string;
        certificate_type?: string;
        document_upload?: string | null;
        issuing_organisation?: string;
      }>
    }
  };
  exception?: string;
  exc_type?: string;
  exc?: string;
  _server_messages?: string;
}

export const addCertificate = async (
  certificateData: CertificateData,
  apiKey: string,
  apiSecret: string
): Promise<AddCertificateResponse> => {
  try {
    console.log('Adding certificate with entity ID:', certificateData.entity_id);
    
    // Create FormData object
    const formData = new FormData();
    formData.append('entity_id', certificateData.entity_id);
    formData.append('document_name', certificateData.document_name);
    formData.append('certificate_type', certificateData.certificate_type);
    formData.append('document_upload', certificateData.document_upload);
    
    // Add issuing organization if available
    if (certificateData.issuing_organisation) {
      formData.append('issuing_organisation', certificateData.issuing_organisation);
    }
    
    // Create authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;
    
    const response = await axios.post<AddCertificateResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.portfolio.certificate.add_certificates`,
      formData,
      {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          // Don't set Content-Type when using FormData, axios will set it with the correct boundary
        }
      }
    );
    
    console.log('Add certificate response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Add certificate error:', error.response?.data || error.message || error);
    throw error;
  }
};

export const getCertificateList = async (
  entityId: string,
  apiKey: string,
  apiSecret: string
): Promise<CertificateListResponse> => {
  try {
    console.log('Getting certificate list for entity ID:', entityId);

    // Authorization header
    const authHeader = `token ${apiKey}:${apiSecret}`;

    // Construct URL with query param
    const url = `${API_BASE_URL}/api/method/skillglobe_be.api.portfolio.certificate.get_certificate_list?entity_id=${entityId}`;

    const response = await axios.get<CertificateListResponse>(url, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });

    console.log('Get certificate list response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get certificate list error:', error.response?.data || error.message || error);
    throw error;
  }
};

export const getAuthData = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    // Get auth data from individual localStorage items
    const apiKey = localStorage.getItem('auth_api_key');
    const apiSecret = localStorage.getItem('auth_api_secret');
    
    // Get entity ID from entity_data
    let entityId = '';
    const entityDataStr = localStorage.getItem('entity_data');
    if (entityDataStr) {
      const entityData = JSON.parse(entityDataStr);
      if (entityData && entityData.details && entityData.details.entity_id) {
        entityId = entityData.details.entity_id;
      }
    }
    
    // Check if we have all required data
    if (!apiKey || !apiSecret || !entityId) {
      console.log('Missing auth data:', { hasApiKey: !!apiKey, hasApiSecret: !!apiSecret, hasEntityId: !!entityId });
      return null;
    }
    
    return {
      apiKey,
      apiSecret,
      entityId
    };
  } catch (error) {
    console.error('Error getting auth data from localStorage:', error);
    return null;
  }
};