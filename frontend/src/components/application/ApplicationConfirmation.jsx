import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

const steps = [
  { id: 1, title: 'Personal Information', description: 'Basic contact details' },
  { id: 2, title: 'Publishing Background', description: 'Your publishing experience' },
  { id: 3, title: 'Manuscript Details', description: 'About your work' },
  { id: 4, title: 'Business Information', description: 'Professional details' },
  { id: 5, title: 'Marketing Strategy', description: 'Promotion plans' },
  { id: 6, title: 'Legal & Documents', description: 'Contracts and uploads' },
  { id: 7, title: 'Review & Submit', description: 'Final confirmation' }
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

const stepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.3
    }
  }
};

export function ApplicationConfirmation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    
    // Address Information
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Publishing Information
    publishingExperience: '',
    genres: [],
    previousPublications: '',
    manuscriptTitle: '',
    manuscriptGenre: '',
    manuscriptWordCount: 0,
    manuscriptSynopsis: '',
    
    // Business Information
    businessName: '',
    businessType: '',
    taxId: '',
    
    // Marketing Information
    targetAudience: '',
    marketingPlan: '',
    socialMediaPresence: '',
    
    // Legal Information
    copyrightOwnership: false,
    previousContracts: false,
    
    // File Uploads
    manuscriptFile: null,
    coverLetter: null,
    authorBio: null,
    marketingMaterials: []
  });

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h3>
              <p className="text-gray-600 mb-6">Let's start with your basic contact details</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'firstName', label: 'First Name', placeholder: 'Enter your first name', type: 'text' },
                { id: 'lastName', label: 'Last Name', placeholder: 'Enter your last name', type: 'text' },
                { id: 'email', label: 'Email Address', placeholder: 'Enter your email', type: 'email' },
                { id: 'phoneNumber', label: 'Phone Number', placeholder: 'Enter your phone number', type: 'tel' }
              ].map((field, index) => (
                <motion.div
                  key={field.id}
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Label
                    htmlFor={field.id}
                    className="text-sm font-semibold text-gray-700"
                  >
                    {field.label}
                  </Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    value={formData[field.id]}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
            </motion.div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Publishing Background</h3>
              <p className="text-gray-600 mb-6">Tell us about your publishing experience and expertise</p>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-2">
                <Label htmlFor="publishingExperience" className="text-sm font-semibold text-gray-700">
                  Publishing Experience
                </Label>
                <textarea
                  id="publishingExperience"
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg resize-none"
                  rows={6}
                  value={formData.publishingExperience}
                  onChange={(e) => handleInputChange('publishingExperience', e.target.value)}
                  placeholder="Describe your publishing experience, previous works, and any relevant background..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousPublications" className="text-sm font-semibold text-gray-700">
                  Previous Publications
                </Label>
                <textarea
                  id="previousPublications"
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg resize-none"
                  rows={4}
                  value={formData.previousPublications}
                  onChange={(e) => handleInputChange('previousPublications', e.target.value)}
                  placeholder="List any previous publications, magazines, books, or articles you've published..."
                />
              </div>
            </motion.div>
          </div>
        );

      default:
        return (
          <motion.div
            className="space-y-8 text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{currentStep}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Step {currentStep}</h3>
            <p className="text-gray-600 text-lg">Content for step {currentStep} will be implemented here.</p>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center">
              Publisher Application
            </CardTitle>
            <div className="mt-6">
              <div className="flex justify-between text-blue-100 mb-3">
                <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
                <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-blue-200/30 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 mb-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      step.id === currentStep
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105'
                        : step.id < currentStep
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: step.id <= currentStep ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {step.title}
                  </motion.div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            <motion.div
              className="flex justify-between mt-12 pt-6 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-8 py-3 text-lg font-medium"
              >
                Previous
              </Button>

              <Button
                onClick={nextStep}
                disabled={currentStep === steps.length}
                className="px-8 py-3 text-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {currentStep === steps.length ? 'Submit Application' : 'Next'}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
