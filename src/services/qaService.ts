import { toast } from 'react-hot-toast';

export interface QAResponse {
  id: string;
  answer: string;
  confidence: number;
  sources: string[];
  upvotes: number;
  downvotes: number;
}

export async function submitQuestion(prompt: string, documentIds: string[]): Promise<QAResponse> {
  try {
    const response = await fetch('/api/qa/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        documentIds,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to process question');
    }

    return data;
  } catch (error) {
    console.error('Error submitting question:', error);
    toast.error('Failed to get answer');
    throw error;
  }
}