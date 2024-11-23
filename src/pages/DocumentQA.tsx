import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Send, ThumbsUp, ThumbsDown, Loader2, FileText } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import toast from 'react-hot-toast';
import { useDocumentQA } from '../hooks/useDocumentQA';

export default function DocumentQA() {
  const {
    isProcessing,
    isQuerying,
    currentResponse,
    handleDocumentUpload,
    handleQuestionSubmit,
    handleFeedbackSubmit,
  } = useDocumentQA();

  const [files, setFiles] = React.useState<File[]>([]);
  const [prompt, setPrompt] = React.useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    try {
      await handleDocumentUpload(acceptedFiles);
      toast.success(`${acceptedFiles.length} file(s) uploaded and processed`);
    } catch (error) {
      toast.error('Failed to process files');
      // Remove the files that failed to process
      setFiles(prev => prev.filter(f => !acceptedFiles.includes(f)));
    }
  }, [handleDocumentUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
  });

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one document');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    try {
      await handleQuestionSubmit(prompt);
    } catch (error) {
      toast.error('Failed to get answer');
    }
  };

  const handleVote = async (type: 'up' | 'down') => {
    try {
      await handleFeedbackSubmit(type);
      toast.success('Feedback submitted');
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Document Q&A
      </h1>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-purple-500'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag and drop files here, or click to select files'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: PDF, DOC, DOCX, TXT
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Uploaded Files:</h3>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-900">{file.name}</span>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prompt Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your question
        </label>
        <div className="space-y-4">
          <TextareaAutosize
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What would you like to know about the documents?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            minRows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={isProcessing || isQuerying}
            className="btn-primary w-full flex items-center justify-center"
          >
            {isQuerying ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Question
              </>
            )}
          </button>
        </div>
      </div>

      {/* Response Section */}
      {currentResponse && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Response</h2>
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700">{currentResponse.answer}</p>
            {currentResponse.sources.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Sources:</h3>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                  {currentResponse.sources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleVote('up')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentResponse.upvotes > 0
                  ? 'bg-green-100 text-green-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              <ThumbsUp className="w-5 h-5" />
              <span>{currentResponse.upvotes}</span>
            </button>
            <button
              onClick={() => handleVote('down')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentResponse.downvotes > 0
                  ? 'bg-red-100 text-red-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              <ThumbsDown className="w-5 h-5" />
              <span>{currentResponse.downvotes}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}