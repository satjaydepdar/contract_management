import { toast } from 'react-hot-toast';

export interface FeedbackResponse {
  success: boolean;
  message: string;
  updatedCounts: {
    upvotes: number;
    downvotes: number;
  };
}

export async function submitFeedback(
  answerId: string,
  type: 'up' | 'down'
): Promise<FeedbackResponse> {
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answerId,
        feedbackType: type,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit feedback');
    }

    return data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    toast.error('Failed to submit feedback');
    throw error;
  }
}