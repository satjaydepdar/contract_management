import { useState } from 'react';
import { processDocuments, DocumentProcessingResponse } from '../services/documentService';
import { submitQuestion, QAResponse } from '../services/qaService';
import { submitFeedback, FeedbackResponse } from '../services/feedbackService';

interface UseDocumentQAReturn {
  isProcessing: boolean;
  isQuerying: boolean;
  processedDocIds: string[];
  currentResponse: QAResponse | null;
  handleDocumentUpload: (files: File[]) => Promise<void>;
  handleQuestionSubmit: (prompt: string) => Promise<void>;
  handleFeedbackSubmit: (type: 'up' | 'down') => Promise<void>;
}

export function useDocumentQA(): UseDocumentQAReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [processedDocIds, setProcessedDocIds] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState<QAResponse | null>(null);

  const handleDocumentUpload = async (files: File[]) => {
    setIsProcessing(true);
    try {
      const response = await processDocuments(files);
      if (response.success && response.vectorIds) {
        setProcessedDocIds(response.vectorIds);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuestionSubmit = async (prompt: string) => {
    if (processedDocIds.length === 0) {
      throw new Error('No documents processed');
    }

    setIsQuerying(true);
    try {
      const response = await submitQuestion(prompt, processedDocIds);
      setCurrentResponse(response);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleFeedbackSubmit = async (type: 'up' | 'down') => {
    if (!currentResponse) {
      throw new Error('No current response');
    }

    const response = await submitFeedback(currentResponse.id, type);
    if (response.success) {
      setCurrentResponse(prev => {
        if (!prev) return null;
        return {
          ...prev,
          upvotes: response.updatedCounts.upvotes,
          downvotes: response.updatedCounts.downvotes,
        };
      });
    }
  };

  return {
    isProcessing,
    isQuerying,
    processedDocIds,
    currentResponse,
    handleDocumentUpload,
    handleQuestionSubmit,
    handleFeedbackSubmit,
  };
}