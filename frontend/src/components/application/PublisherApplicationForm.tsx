import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';

// TEMPORARILY DISABLED - Cover image related imports commented out
// import { Palette, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { config } from '@/lib/config';
// TEMPORARILY DISABLED - Supabase import commented out (only used for image upload)
// import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import styles from './PublisherApplicationForm.module.css';

// Stock Images Import Section - Using actual cover template images

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

// TEMPORARILY DISABLED - Stock Images Array commented out per boss request
/*
const stockImages = {
  'art': {
    name: 'Art & Design',
    images: [
      '/cover-templates/Art-and-Design-Image1.avif',
      '/cover-templates/Art-and-Design-Image2.avif',
      '/cover-templates/Art-and-Design-Image3.avif',
      '/cover-templates/Art-and-Design-Image4.avif'
    ]
  },
  'fashion': {
    name: 'Fashion',
    images: [
      '/cover-templates/Fashion-Image-1.avif',
      '/cover-templates/Fashion-Image-2.avif',
      '/cover-templates/Fashion-Image-3.avif',
      '/cover-templates/Fashion-Image-4.avif'
    ]
  },
  'photography': {
    name: 'Photography',
    images: [
      '/cover-templates/Photography-Image-1.avif',
      '/cover-templates/Photography-Image-2.avif',
      '/cover-templates/Photography-Image-3.avif',
      '/cover-templates/Photography-Image-4.avif'
    ]
  },
  'culture': {
    name: 'Culture',
    images: [
      '/cover-templates/Culture-Image-1.avif',
      '/cover-templates/Culture-Image-2.avif',
      '/cover-templates/Culture-Image-3.avif',
      '/cover-templates/Culture-Image-4.avif',
      '/cover-templates/Culture-Image-5.avif'
    ]
  },
  'science': {
    name: 'Science',
    images: [
      '/cover-templates/Science-Image-1.avif',
      '/cover-templates/Science-Image-2.avif',
      '/cover-templates/Science-Image-3.avif',
      '/cover-templates/Science-Image-4.avif'
    ]
  },
  'lifestyle': {
    name: 'Lifestyle',
    images: [
      '/cover-templates/Lifestyle-Image-1.avif',
      '/cover-templates/Lifestye-Image-2.avif',
      '/cover-templates/Lifestye-Image-3.avif',
      '/cover-templates/Lifestye-Image-4.avif'
    ]
  },
  'books': {
    name: 'Books',
    images: [
      '/cover-templates/Books-Image-1.avif',
      '/cover-templates/Books-Image-2.avif',
      '/cover-templates/Books-Image-3.avif',
      '/cover-templates/Books-Image-4.avif'
    ]
  },
  'music': {
    name: 'Music',
    images: [
      '/cover-templates/Music-Image-1.avif',
      '/cover-templates/Music-Image-2.avif',
      '/cover-templates/Music-Image-3.avif',
      '/cover-templates/Music-Image-4.avif'
    ]
  },
  'travel': {
    name: 'Travel',
    images: [
      '/cover-templates/Travel-Image-1.avif',
      '/cover-templates/Travel-Image-2.avif',
      '/cover-templates/Travel-Image-3.avif',
      '/cover-templates/Travel-Image-4.avif'
    ]
  },
  'food': {
    name: 'Food',
    images: [
      '/cover-templates/Food-Image-1.avif',
      '/cover-templates/Food-Image-2.avif',
      '/cover-templates/Food-Image-3.avif',
      '/cover-templates/Food-Image-4.avif'
    ]
  }
};
*/

const PublisherApplicationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ApplicationData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // TEMPORARILY DISABLED - Cover image related state variables commented out
  // const [isUploading, setIsUploading] = useState(false);
  // const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');

  const { toast } = useToast();

  // TEMPORARILY DISABLED - Carousel navigation state commented out
  /*
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({
    art: 0,
    fashion: 0,
    photography: 0,
    culture: 0,
    science: 0,
    lifestyle: 0,
    books: 0,
    music: 0,
    travel: 0,
    food: 0
  });
  */

  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof ApplicationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // TEMPORARILY DISABLED - Cover image related functions commented out
  /*
  // Carousel navigation functions
  const navigateImage = (category: string, direction: 'prev' | 'next') => {
    const categoryImages = stockImages[category as keyof typeof stockImages];
    if (!categoryImages) return;

    const currentIndex = currentImageIndex[category];
    const maxIndex = categoryImages.images.length - 1;

    let newIndex = currentIndex;
    if (direction === 'next' && currentIndex < maxIndex) {
      newIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    setCurrentImageIndex(prev => ({
      ...prev,
      [category]: newIndex
    }));
  };

  // Selection Handler Function
  const useStockImage = (stockImageSrc: string) => {
    console.log('Selecting stock image:', stockImageSrc);

    // Check if user has uploaded a custom image
    const hasCustomImage = formData.cover_image_url &&
      !Object.values(stockImages).some(category =>
        category.images.includes(formData.cover_image_url)
      );

    if (hasCustomImage) {
      const confirmReplace = window.confirm(
        'You have uploaded a custom image. Do you want to replace it with this stock template?'
      );
      if (!confirmReplace) {
        return;
      }
    }

    updateFormData('cover_image_url', stockImageSrc);
    console.log('Updated formData.cover_image_url to stock image:', stockImageSrc);
  };

  // Remove selected cover image
  const removeCoverImage = () => {
    updateFormData('cover_image_url', '');
    setUploadedImageUrl(''); // Clear local state too
    console.log('Removed cover image selection');
  };
  */

  // TEMPORARILY DISABLED - Image upload functions commented out
  /*
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }

    // Check image dimensions
    const img = new Image();
    img.onload = async () => {
      if (img.width < 500 || img.height < 889) {
        toast({
          title: "Image too small",
          description: "Cover image must be at least 500px × 889px. Current size: " + img.width + "px × " + img.height + "px",
          variant: "destructive"
        });
        // Clear the input
        event.target.value = '';
        return;
      }

      // If dimensions are valid, proceed with upload
      await processImageUpload(file);
    };

    img.onerror = () => {
      toast({
        title: "Invalid image",
        description: "Could not read image file.",
        variant: "destructive"
      });
      event.target.value = '';
    };

    img.src = URL.createObjectURL(file);
  };

  const processImageUpload = async (file: File) => {

    setIsUploading(true);

    try {
      console.log('Starting upload process for unauthenticated user...');

      // Create simple filename without folder structure for now
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      console.log('Upload filename:', fileName);

      console.log('Attempting upload to product-images bucket...');
      const { data, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      console.log('Upload result:', { data, uploadError });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      updateFormData('cover_image_url', urlData.publicUrl);
      setUploadedImageUrl(urlData.publicUrl); // Set local state immediately

      toast({
        title: "Image uploaded successfully",
        description: "Your cover image has been uploaded.",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: `There was an error uploading your image: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  */

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

    try {
      console.log('📊 Publisher Application - Form Data:', formData);

      // Prepare data for Supabase insertion (mapping to actual database column names)
      const submissionData = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        business_name: formData.business_name,
        magazine_title: formData.magazine_title,
        publication_type: formData.publication_type,
        issue_number: formData.issue_number,
        issue_frequency: formData.issue_frequency,
        description: formData.description,
        social_website_link: formData.social_website_link,
        print_run: formData.print_run ? parseInt(formData.print_run.toString()) : 0,
        available_quantity: formData.available_quantity ? parseInt(formData.available_quantity.toString()) : 0,
        wholesale_price: formData.wholesale_price ? parseFloat(formData.wholesale_price.toString()) : 0,
        suggested_retail_price: formData.suggested_retail_price ? parseFloat(formData.suggested_retail_price.toString()) : 0,
        specs: formData.specs,
        volume_pricing_tiers: formData.volume_pricing || [], // Fixed: matches DB column name
        cover_image_url: formData.cover_image_url,
        has_sold_before: formData.has_sold_before === 'yes', // Convert to boolean to match DB type
        distribution_channels: formData.distribution_channels || [],
        copies_sold_estimate: formData.estimated_copies_sold ? parseInt(formData.estimated_copies_sold.toString()) : 0, // Fixed: matches DB column name
        quotes_feedback: formData.sales_feedback, // Fixed: matches DB column name
        fulfillment_method: formData.fulfillment_method,
        shipping_city: formData.shipping_city,
        shipping_state: formData.shipping_state,
        shipping_country: formData.shipping_country,
        accepts_returns: formData.return_policy, // Fixed: matches DB column name
        status: 'pending'
      };

      console.log('🔄 Submitting publisher application:', submissionData);
      console.log('🔍 Submission data keys:', Object.keys(submissionData));
      console.log('🔍 Cover image URL:', submissionData.cover_image_url);

      const response = await fetch(`${config.supabase.url}/functions/v1/publisher-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.supabase.anonKey}`,
          'apikey': config.supabase.anonKey,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to submit application');
      }

      const result = await response.json();
      console.log('✅ Application submitted successfully:', result);

      // Email notification is handled automatically by database trigger

      // Show success and go to confirmation
      toast({ title: "Application submitted successfully! We'll review it and get back to you soon." });

      setCurrentStep(7); // Go to confirmation
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({ title: "Submission failed. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={styles.startingPageContainer}>
            <div className={styles.startingPageText}>
              <div className="max-w-2xl mx-auto text-left">
                <p className="text-lg font-medium text-gray-800 mb-4">
                  We're building tools to make indie distribution less painful and more
                  sustainable. If you're printing physical copies and ready to sell to shops,
                  you're in the right place.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6" 
                style={{ fontSize: '15px' , position: 'relative', top: '40px' }}>
                  <li>
                    Most publishers on Neesh print between <strong>500–10,000 copies</strong> per issue.
                  </li>
                  <li>
                    We review every application based on <strong>quality, operational readiness, and fit</strong>.
                  </li>
                  <li>
                    Filling this out takes about <strong>5-10 minutes</strong>.
                  </li>
                </ul>
              </div>

              <div className={styles.buttonContainer}>
                <Button
                  onClick={nextStep}
                  className={styles.startButton}
                >
                  Start Application
                </Button>

                <Button
                  onClick={() => window.location.href = '/'}
                  className={styles.cancelButton}
                >
                  Cancel
                </Button>
              </div>

              <p className={styles.alreadyAppliedText}>
                Already applied? You can submit new issues using the same process.
              </p>
            </div>

            <div className={styles.magazineImageContainer}>
              <img
                src="/magazine-photo-yellow.jpg"
                alt="Magazine"
                className={styles.magazineImage}
              />
            </div>
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
              <div className="flex mt-2" style={{ gap: '10px' }}>
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
                    type="number"
                    min="1"
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
          <div className="space-y-6 step-3-inputs" style={{ padding: '25px' }}>
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
            {/* TEMPORARILY DISABLED - Cover Image functionality commented out per boss request */}
            {/*
            <div>
              <Label>Cover Image</Label>
              <div className="mt-4 space-y-6">
                {/* Stock Images Section */}
                {/*
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <Label>Choose from Stock Covers</Label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(stockImages).map(([categoryKey, category]) => {
                      const currentIndex = currentImageIndex[categoryKey];
                      const currentImage = category.images[currentIndex];
                      const isSelected = formData.cover_image_url === currentImage;

                      return (
                        <div
                          key={categoryKey}
                          className={`cursor-pointer transition-all border rounded-lg ${
                            isSelected
                              ? 'ring-2 ring-primary bg-primary/5'
                              : 'hover:ring-2 hover:ring-primary/50'
                          }`}
                          onClick={() => useStockImage(currentImage)}
                        >
                          <div className={`p-2 ${styles.stockImageCarousel}`}>
                            {/* Navigation arrows */}
                            {/*
                            <div className={styles.carouselNavigation}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateImage(categoryKey, 'prev');
                                }}
                                disabled={currentIndex === 0}
                                className={styles.carouselButton}
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateImage(categoryKey, 'next');
                                }}
                                disabled={currentIndex === category.images.length - 1}
                                className={styles.carouselButton}
                              >
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            </div>

                            <img
                              src={currentImage}
                              alt={category.name}
                              className="w-full h-16 object-cover rounded"
                              style={{ maxHeight: '200px' }}
                            />
                            <p className="text-xs text-center mt-1 text-muted-foreground">
                              {category.name}
                            </p>
                            <p className={styles.imageCounter}>
                              {currentIndex + 1} / {category.images.length}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Upload Section */}
                {/*
                <div className="space-y-2">
                  <Label htmlFor="cover_image">Or upload your own cover image</Label>
                  <p className="text-sm text-gray-600">
                    Minimum size: 500px × 889px. Recommended formats: JPG, PNG, AVIF
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="uploadContainer">
                      <Input

                        id="cover_image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="uploadButton"
                      />
                      {isUploading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      )}
                    </div>

                    {(formData.cover_image_url || uploadedImageUrl) && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-blue-800">Selected Cover Image:</h4>
                          <button
                            type="button"
                            onClick={removeCoverImage}
                            className={styles.removeCoverButton}
                            title="Remove selected cover image"
                          >
                            <X className={styles.removeCoverIcon} />
                            Remove
                          </button>
                        </div>
                        {(() => {
                          const currentImageUrl = formData.cover_image_url || uploadedImageUrl;
                          const isStockImage = Object.values(stockImages).some(category =>
                            category.images.includes(currentImageUrl)
                          );

                          return (
                            <>
                              {isStockImage ? (
                                <div className="flex items-center gap-2 text-sm text-blue-600">
                                  <span>✓ Stock template selected</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                  <span>✓ Custom image uploaded</span>
                                </div>
                              )}
                              <div className="mt-2">
                                <img
                                  src={currentImageUrl}
                                  alt="Selected cover"
                                  className="w-20 h-28 object-cover border rounded"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1 break-all">
                                {currentImageUrl}
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Front cover only, for now</p>
                </div>
                */}
              {/*
              </div>
            </div>
            */}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6" style={{ padding: '25px' }}>
            <h3 className="text-2xl font-semibold" style={{ padding: '0px 0px 16px 0px' }}>Sales Experience</h3>
            <div>
              <Label>Have you sold this issue before? *</Label>
              <div className="flex mt-2" style={{ gap: '10px' }}>
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
                  <div className="grid grid-cols-2 gap-2 mt-2" style={{ marginBottom: '5px' }}>
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
              {formData.cover_image_url && (
                <div>
                  <h4 className="font-semibold">Cover Image</h4>
                  <div className="mt-2">
                    <img
                      src={formData.cover_image_url}
                      alt="Magazine Cover"
                      className="border rounded-lg shadow-sm"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '600px',
                        width: 'auto',
                        height: 'auto'
                      }}
                      onError={(e) => {
                        console.error('Image failed to load:', formData.cover_image_url);
                        console.error('Error event:', e);
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', formData.cover_image_url);
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL: {formData.cover_image_url}
                    </p>
                  </div>
                </div>
              )}
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
              <span className="text-3xl text-white"
              style={{ position: 'relative', bottom: '20px' }}
              >✓</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800" style={{ position: 'relative', bottom: '25px' }}>You're all set</h3>
            <div className="space-y-4 max-w-2xl mx-auto">
              <p className="text-gray-600"style={{ position: 'relative', bottom: '20px' }}>We've received your application.</p>
              <p className="text-gray-600"style={{ position: 'relative', bottom: '20px' }}>
                You'll hear from us within 5 to 7 business days with next steps.
                If we have questions, we'll reach out directly.
              </p>
              <p className="text-gray-600" style={{ position: 'relative', bottom: '11px' }}>In the meantime, keep an eye on your inbox.</p>
            </div>
            <Button
              onClick={() => window.location.href = '/dashboard-coming-soon'}
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
    <div className={styles.applicationContainer}>
      <div className={styles.applicationCard}>
        {/* Black Header */}
        <div className={styles.applicationHeader}>
          <h1 className={styles.applicationTitle}>
            Partner with shops that celebrate independent print
          </h1>
        </div>

        {currentStep > 0 && (
          <div className={styles.progressContainer}>
            <div className="flex justify-between text-gray-600 mb-3">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps - 1}</span>
              <span className="text-sm font-medium">{currentStep === 7 ? 'Completed' : `${Math.round(progress)}% Complete`}</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-700" />
          </div>
        )}

        <div className={styles.applicationContent}>
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
            <div className={styles.navigationContainer}>
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={styles.backButton}
              >
                Back
              </Button>
              <Button
                onClick={currentStep === 6 ? handleSubmit : nextStep}
                disabled={currentStep > 0 && !validateStep(currentStep)}
                className={`${styles.continueButton} ${isSubmitting ? 'opacity-50' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : currentStep === 6 ? 'Submit Application' : 'Continue'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublisherApplicationForm;
