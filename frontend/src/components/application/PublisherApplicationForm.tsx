import React, { useState } from 'react';
import { motion, AnimatePresence, px } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

// Data structure interface
interface ApplicationData {
  // Account Info
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  business_name: string;
  
  // Magazine Details
  magazine_title: string;
  publication_type: 'single' | 'series' | '';
  issue_number: string;
  issue_frequency: string;
  description: string;
  social_website_link: string;
  
  // Print & Pricing
  print_run: number;
  available_quantity: number;
  wholesale_price: number;
  suggested_retail_price: number;
  specs: string;
  volume_pricing: Array<{
    min_quantity: number;
    price_per_unit: number;
  }>;
  cover_image_url: string;
  
  // Sales Experience
  has_sold_before: 'yes' | 'no' | '';
  distribution_channels: string[];
  estimated_copies_sold: number;
  sales_feedback: string;
  
  // Fulfillment
  fulfillment_method: string;
  shipping_city: string;
  shipping_state: string;
  shipping_country: string;
  return_policy: string;
}

const initialData: ApplicationData = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  business_name: '',
  magazine_title: '',
  publication_type: '',
  issue_number: '',
  issue_frequency: '',
  description: '',
  social_website_link: '',
  print_run: 0,
  available_quantity: 0,
  wholesale_price: 0,
  suggested_retail_price: 0,
  specs: '',
  volume_pricing: [{ min_quantity: 0, price_per_unit: 0 }],
  cover_image_url: '',
  has_sold_before: '',
  distribution_channels: [],
  estimated_copies_sold: 0,
  sales_feedback: '',
  fulfillment_method: '',
  shipping_city: '',
  shipping_state: '',
  shipping_country: '',
  return_policy: ''
};

const PublisherApplicationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ApplicationData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof ApplicationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Account Information
        return !!(formData.first_name && formData.last_name && formData.email && 
                 formData.password && formData.business_name);
      case 2: // Magazine Details
        return !!(formData.magazine_title && formData.publication_type && formData.description);
      case 3: // Print Run & Pricing
        return !!(formData.print_run && formData.available_quantity && 
                 formData.wholesale_price && formData.suggested_retail_price);
      case 4: // Sales Experience
        return !!(formData.has_sold_before);
      case 5: // Fulfillment & Logistics
        return !!(formData.fulfillment_method && formData.shipping_city && 
                 formData.shipping_state && formData.shipping_country && formData.return_policy);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1 && (currentStep === 0 || validateStep(currentStep))) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentStep(7); // Go to confirmation
    setIsSubmitting(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 text-center py-8" style={{ padding: 25 }}>
            <h2 className="text-3xl font-bold text-gray-800" style={{ padding: '0px 0px 16px 0px' }}>Apply to list your magazine on Neesh</h2>
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              <p className="text-gray-600 leading-relaxed">
                We're building tools to make indie distribution less painful and more sustainable. 
                If you're printing physical copies and ready to sell to shops, you're in the right place.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Most of the publishers on Neesh print between 500 and 10,000 copies per issue. 
                We review every application based on quality, operational readiness, and fit.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Filling this out takes about 10–15 minutes.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Already applied? You can submit new issues using the same process.
              </p>
            </div>
            <Button
              onClick={nextStep}
              className="mt-8"
              style={{
                background: '#000',
                color: 'white',
                border: 'none',
                padding: '7px 8px 9px 9px',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              Start Application
            </Button>
            
            <Button
              onClick={() => window.location.href = '/'}
              className="mt-8"
              style={{
                background: '#ffffff',
                color: 'black',
                border: 'none',
                padding: '12px 24px',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              Cancel
            </Button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6" style={{ padding: '25px' }}>
            <h3 className="text-2xl font-semibold" style={{ padding: '0px 0px 16px 0px' }}>Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => updateFormData('first_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => updateFormData('last_name', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                minLength={6}
                required
              />
              <p className="text-sm text-gray-500 mt-1">Minimum 6 characters</p>
            </div>
            <div>
              <Label htmlFor="business_name">Business/Publisher Name *</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => updateFormData('business_name', e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6" style={{ padding: '25px' }}>
            <h3 className="text-2xl font-semibold" style={{ padding: '0px 0px 16px 0px' }}>Magazine Details</h3>
            <div>
              <Label htmlFor="magazine_title">Magazine Title *</Label>
              <Input
                id="magazine_title"
                value={formData.magazine_title}
                onChange={(e) => updateFormData('magazine_title', e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Publication Type *</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="publication_type"
                    value="single"
                    checked={formData.publication_type === 'single'}
                    onChange={(e) => updateFormData('publication_type', e.target.value)}
                    className="mr-2"
                  />
                  Single Issue
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="publication_type"
                    value="series"
                    checked={formData.publication_type === 'series'}
                    onChange={(e) => updateFormData('publication_type', e.target.value)}
                    className="mr-2"
                  />
                  Series
                </label>
              </div>
            </div>
            {formData.publication_type === 'series' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issue_number">Issue Number</Label>
                  <Input
                    id="issue_number"
                    value={formData.issue_number}
                    onChange={(e) => updateFormData('issue_number', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="issue_frequency">Issue Frequency</Label>
                  <select
                    id="issue_frequency"
                    value={formData.issue_frequency}
                    onChange={(e) => updateFormData('issue_frequency', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select frequency</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="bi-annual">Bi-annual</option>
                    <option value="annual">Annual</option>
                    <option value="irregular">Irregular</option>
                  </select>
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-32"
                required
              />
            </div>
            <div>
              <Label htmlFor="social_website_link">Social/Website Link</Label>
              <Input
                id="social_website_link"
                value={formData.social_website_link}
                onChange={(e) => updateFormData('social_website_link', e.target.value)}
                placeholder="https://"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6" style={{ padding: '25px' }}>
            <h3 className="text-2xl font-semibold" style={{ padding: '0px 0px 16px 0px' }}>Print Run & Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="print_run">Print Run *</Label>
                <Input
                  id="print_run"
                  type="number"
                  value={formData.print_run || ''}
                  onChange={(e) => updateFormData('print_run', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="available_quantity">Available Quantity *</Label>
                <Input
                  id="available_quantity"
                  type="number"
                  value={formData.available_quantity || ''}
                  onChange={(e) => updateFormData('available_quantity', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wholesale_price">Wholesale Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="wholesale_price"
                    type="number"
                    step="0.01"
                    value={formData.wholesale_price || ''}
                    onChange={(e) => updateFormData('wholesale_price', parseFloat(e.target.value) || 0)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="suggested_retail_price">Suggested Retail Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="suggested_retail_price"
                    type="number"
                    step="0.01"
                    value={formData.suggested_retail_price || ''}
                    onChange={(e) => updateFormData('suggested_retail_price', parseFloat(e.target.value) || 0)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="specs">Specs</Label>
              <textarea
                id="specs"
                value={formData.specs}
                onChange={(e) => updateFormData('specs', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-24"
                placeholder="Additional details about your magazine specifications..."
              />
            </div>
            <div>
              <Label>Cover Image</Label>
              <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <p className="text-gray-500">Stock image selection and custom upload will be implemented here</p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6" style={{ padding: '25px' }}>
            <h3 className="text-2xl font-semibold" style={{ padding: '0px 0px 16px 0px' }}>Sales Experience</h3>
            <div>
              <Label>Have you sold this issue before? *</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="has_sold_before"
                    value="yes"
                    checked={formData.has_sold_before === 'yes'}
                    onChange={(e) => updateFormData('has_sold_before', e.target.value)}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="has_sold_before"
                    value="no"
                    checked={formData.has_sold_before === 'no'}
                    onChange={(e) => updateFormData('has_sold_before', e.target.value)}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
            {formData.has_sold_before === 'yes' && (
              <>
                <div>
                  <Label>Distribution Channels</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Online Direct', 'Local Bookstores', 'Newsstands', 'Subscription', 'Events/Markets', 'Other'].map((channel) => (
                      <label key={channel} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.distribution_channels.includes(channel)}
                          onChange={(e) => {
                            const channels = e.target.checked
                              ? [...formData.distribution_channels, channel]
                              : formData.distribution_channels.filter(c => c !== channel);
                            updateFormData('distribution_channels', channels);
                          }}
                          className="mr-2"
                        />
                        {channel}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="estimated_copies_sold">Estimated Copies Sold</Label>
                  <Input
                    id="estimated_copies_sold"
                    type="number"
                    value={formData.estimated_copies_sold || ''}
                    onChange={(e) => updateFormData('estimated_copies_sold', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="sales_feedback">What feedback have you received?</Label>
                  <textarea
                    id="sales_feedback"
                    value={formData.sales_feedback}
                    onChange={(e) => updateFormData('sales_feedback', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md h-24"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6" style={{ padding: '25px' }}>
            <h3 className="text-2xl font-semibold" style={{ padding: '0px 0px 16px 0px' }}>Fulfillment & Logistics</h3>
            <div>
              <Label htmlFor="fulfillment_method">Fulfillment Method *</Label>
              <select
                id="fulfillment_method"
                value={formData.fulfillment_method}
                onChange={(e) => updateFormData('fulfillment_method', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select fulfillment method</option>
                <option value="self-fulfillment">Self-fulfillment</option>
                <option value="third-party">Third-party logistics</option>
                <option value="neesh">Neesh fulfillment</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="shipping_city">Shipping City *</Label>
                <Input
                  id="shipping_city"
                  value={formData.shipping_city}
                  onChange={(e) => updateFormData('shipping_city', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="shipping_state">Shipping State *</Label>
                <Input
                  id="shipping_state"
                  value={formData.shipping_state}
                  onChange={(e) => updateFormData('shipping_state', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="shipping_country">Shipping Country *</Label>
                <Input
                  id="shipping_country"
                  value={formData.shipping_country}
                  onChange={(e) => updateFormData('shipping_country', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="return_policy">Return Policy *</Label>
              <textarea
                id="return_policy"
                value={formData.return_policy}
                onChange={(e) => updateFormData('return_policy', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md h-32"
                required
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6" style={{ padding: '25px' }}>
            <h3 className="text-2xl font-semibold" style={{ padding: '0px 0px 16px 0px' }}>Review & Submit</h3>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h4 className="font-semibold">Account Information</h4>
                <p>{formData.first_name} {formData.last_name} ({formData.email})</p>
                <p>{formData.business_name}</p>
              </div>
              <div>
                <h4 className="font-semibold">Magazine Details</h4>
                <p><strong>Title:</strong> {formData.magazine_title}</p>
                <p><strong>Type:</strong> {formData.publication_type}</p>
                <p><strong>Description:</strong> {formData.description}</p>
              </div>
              <div>
                <h4 className="font-semibold">Pricing</h4>
                <p><strong>Print Run:</strong> {formData.print_run}</p>
                <p><strong>Wholesale:</strong> ${formData.wholesale_price}</p>
                <p><strong>Retail:</strong> ${formData.suggested_retail_price}</p>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-8 text-center" style={{ padding: '25px' }}>
            <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-3xl text-white">✓</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">You're all set</h3>
            <div className="space-y-4 max-w-2xl mx-auto">
              <p className="text-gray-600">We've received your application.</p>
              <p className="text-gray-600">
                You'll hear from us within 5 to 7 business days with next steps.
                If we have questions, we'll reach out directly.
              </p>
              <p className="text-gray-600">In the meantime, keep an eye on your inbox.</p>
            </div>
            <Button
              onClick={() => window.location.href = '/publisher-dashboard'}
              style={{
                background: '#000',
                color: 'white',
                border: 'none'
              }}
            >
              Return to Dashboard
            </Button>
          </div>
        );

      default:
        return (
          <div className="space-y-8 text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{currentStep}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Step {currentStep}</h3>
            <p className="text-gray-600 text-lg">Content for step {currentStep} will be implemented here.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #f8f6f3 0%, #e8e6e3 100%)',
      paddingLeft: '75px',
      paddingRight: '75px',
      paddingTop: '50px',
      paddingBottom: '50px'
    }}>
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border border-gray-200 bg-white">
          <CardHeader style={{ background: '#000', color: 'white' }} className="rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center" style={{ color: 'white' }}>
              Apply to list your magazine on Neesh
            </CardTitle>
            {currentStep > 0 && (
              <div className="mt-6">
                <div className="flex justify-between text-gray-200 mb-3">
                  <span className="text-sm font-medium">Step {currentStep} of {totalSteps - 1}</span>
                  <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2 bg-gray-700" />
              </div>
            )}
          </CardHeader>
          <CardContent className="p-8" style={{ backgroundColor: 'white' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
            
            {currentStep > 0 && currentStep < 7 && (
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  style={{
                    border: '1px solid #666',
                    color: '#666',
                    background: 'transparent'
                  }}
                >
                  Back
                </Button>
                <Button
                  onClick={currentStep === 6 ? handleSubmit : nextStep}
                  disabled={currentStep > 0 && !validateStep(currentStep)}
                  className={isSubmitting ? 'opacity-50' : ''}
                  style={{
                    background: '#000',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : currentStep === 6 ? 'Submit Application' : 'Continue'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublisherApplicationForm;
