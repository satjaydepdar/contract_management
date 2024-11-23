import { toast } from 'react-hot-toast';

export interface DocumentProcessingResponse {
  success: boolean;
  message: string;
  vectorIds?: string[];
}

export async function processDocuments(files: File[]): Promise<DocumentProcessingResponse> {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('documents', file);
    });

    const response = await fetch('/api/documents/process', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to process documents');
    }

    return data;
  } catch (error) {
    console.error('Error processing documents:', error);
    toast.error('Failed to process documents');
    throw error;
  }
}