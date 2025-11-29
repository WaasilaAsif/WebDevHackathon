import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles } from 'lucide-react';
import FileUploader from '../../components/upload/FileUploader';
import Card from '../../components/ui/Card';

const UploadResume = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    handleUpload(file);
  };

  const handleUpload = async (file) => {
    setIsProcessing(true);
    
    // Developer B will implement actual upload and processing
    // Simulate processing
    setTimeout(() => {
      console.log('Processing file:', file.name);
      setIsProcessing(false);
      navigate('/resume-result?id=mock123');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
          <FileText className="text-blue-600" size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Upload Your Resume
        </h1>
        <p className="text-gray-600">
          Let our AI analyze your resume and extract key information
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <FileUploader onFileSelect={handleFileSelect} />
      </Card>

      {/* Processing Status */}
      {isProcessing && (
        <Card>
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Analyzing Your Resume
            </h3>
            <p className="text-gray-600 mb-4">
              Our AI is extracting skills, experience, and education...
            </p>
            <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </Card>
      )}

      {/* Information Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card padding="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-purple-600" size={24} />
            <h3 className="font-bold text-gray-800">AI-Powered</h3>
          </div>
          <p className="text-sm text-gray-600">
            Advanced AI extracts and structures your information accurately
          </p>
        </Card>
        
        <Card padding="p-4">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-blue-600" size={24} />
            <h3 className="font-bold text-gray-800">Detailed Analysis</h3>
          </div>
          <p className="text-sm text-gray-600">
            Get insights on skills, experience levels, and proficiency
          </p>
        </Card>
        
        <Card padding="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-green-600" size={24} />
            <h3 className="font-bold text-gray-800">Instant Results</h3>
          </div>
          <p className="text-sm text-gray-600">
            Receive structured resume insights in seconds
          </p>
        </Card>
      </div>

      {/* Tips Section */}
      <Card title="Tips for Best Results">
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Use a clear, well-formatted PDF resume</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Include technical skills, projects, and experience</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Keep file size under 5MB for faster processing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Avoid scanned images or poorly formatted documents</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default UploadResume;