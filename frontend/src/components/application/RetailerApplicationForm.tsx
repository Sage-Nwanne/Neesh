import React, { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Loader2, ChevronLeft, ChevronRight, X, Store, MapPin, Briefcase, Palette } from 'lucide-react';
import { config } from '@/lib/config';
import { toast } from '../../hooks/use-toast';
import { useFormTracking, useAnalytics } from '@/hooks/useAnalytics';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import styles from './RetailerApplicationForm.module.css';

// Data structure interface
interface RetailerApplicationData {
  // Shop Info
  shop_name: string;
  business_address_line_1: string;
  business_address_line_2: string;
  business_city: string;
  business_state: string;
  business_zip_code: string;
  business_country: string;
  
  // Store Details
  store_category: string;
  store_type: string;
  store_size: string;
  years_in_business: number;
  
  // Contact Info
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  
  // Business Operations
  pos_system: string;
  monthly_magazine_budget: number;
  preferred_delivery_frequency: string;
  current_magazine_sources: string[];
  current_magazine_titles: string;
  
  // Store Profile
  target_customers: string[];
  aesthetic_preferences: string[];
  interested_genres: string[];
}

const initialData: RetailerApplicationData = {
  shop_name: '',
  business_address_line_1: '',
  business_address_line_2: '',
  business_city: '',
  business_state: '',
  business_zip_code: '',
  business_country: 'US',
  store_category: '',
  store_type: '',
  store_size: '',
  years_in_business: 0,
  buyer_name: '',
  buyer_email: '',
  buyer_phone: '',
  pos_system: '',
  monthly_magazine_budget: 0,
  preferred_delivery_frequency: '',
  current_magazine_sources: [],
  current_magazine_titles: '',
  target_customers: [],
  aesthetic_preferences: [],
  interested_genres: []
};

// Constants
const STORE_CATEGORIES = ['Independent Bookstore', 'Coffee Shop/Cafe', 'Boutique/Fashion', 'Gift Shop', 'Art Gallery', 'Museum Shop', 'Hotel/Lobby Shop', 'University Bookstore', 'Lifestyle Store', 'Other'];
const STORE_TYPES = ['Independent', 'Small Chain (2-5 locations)', 'Regional Chain (6-20 locations)', 'National Chain (20+ locations)'];
const STORE_SIZES = ['Small (under 1,000 sq ft)', 'Medium (1,000-3,000 sq ft)', 'Large (over 3,000 sq ft)'];
const TARGET_CUSTOMERS = ['Young Adults (18-30)', 'Millennials (30-40)', 'Gen X (40-55)', 'Baby Boomers (55+)', 'Families with Children', 'Students', 'Tourists/Visitors', 'Art & Design Enthusiasts', 'Local Community'];
const AESTHETIC_PREFERENCES = ['Minimalist/Clean', 'Vintage/Retro', 'Eclectic/Bohemian', 'Modern/Contemporary', 'Industrial/Urban', 'Cozy/Homey', 'Sophisticated/Upscale', 'Artistic/Creative'];
const POS_SYSTEMS = ['Square', 'Shopify POS', 'Clover', 'Toast', 'Lightspeed', 'Vend', 'Cash Register', 'Other'];
const MAGAZINE_SOURCES = ['Ubiquity Distributors', 'Ingram Periodicals', 'TNG', 'Direct from Publishers', 'Local Distributors', 'None Currently', 'Other'];
const DELIVERY_FREQUENCIES = ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'As Needed'];
const INTERESTED_GENRES = ['Art & Design', 'Culture & Society', 'Fashion & Style', 'Food & Drink', 'Lifestyle', 'Literature & Poetry', 'Music', 'Photography', 'Politics & Current Affairs', 'Science & Technology', 'Travel', 'Independent/Zines'];

const RetailerApplicationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0); // Start at 0 for intro page
  const [formData, setFormData] = useState<RetailerApplicationData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [applicationId, setApplicationId] = useState<string>('');

  // Analytics hooks
  const formTracking = useFormTracking('retailer_application');
  const { trackApplicationSubmission } = useAnalytics();
  // Simple state to control overlay visibility
  const [showOverlay, setShowOverlay] = useState(false);
  // Track which dropdowns are open for spacing
  const [openDropdowns, setOpenDropdowns] = useState({
    category: false,
    type: false,
    size: false,
    pos: false,
    frequency: false
  });



  const totalSteps = 6; // Including confirmation page
  const progress = currentStep === 0 ? 0 : ((currentStep - 1) / (totalSteps - 1)) * 100;

  const handleInputChange = (field: keyof RetailerApplicationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleArrayToggle = (field: keyof RetailerApplicationData, value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleInputChange(field, newArray);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.shop_name) newErrors.shop_name = 'Shop name is required';
        if (!formData.store_category) newErrors.store_category = 'Store category is required';
        if (!formData.store_type) newErrors.store_type = 'Store type is required';
        if (!formData.store_size) newErrors.store_size = 'Store size is required';
        break;
      case 2:
        if (!formData.business_address_line_1) newErrors.business_address_line_1 = 'Address is required';
        if (!formData.business_city) newErrors.business_city = 'City is required';
        if (!formData.business_state) newErrors.business_state = 'State is required';
        if (!formData.business_zip_code) newErrors.business_zip_code = 'ZIP code is required';
        break;
      case 3:
        if (!formData.buyer_name) newErrors.buyer_name = 'Buyer name is required';
        if (!formData.buyer_email) newErrors.buyer_email = 'Email is required';
        break;
      case 4:
        if (formData.target_customers.length === 0) newErrors.target_customers = 'Select at least one target customer';
        if (formData.aesthetic_preferences.length === 0) newErrors.aesthetic_preferences = 'Select at least one aesthetic preference';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      const nextStepNumber = Math.min(currentStep + 1, totalSteps);
      setCurrentStep(nextStepNumber);
      formTracking.trackFormStep(nextStepNumber, `step_${nextStepNumber}`);
    } else {
      formTracking.trackFormError(`Validation failed on step ${currentStep}`);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const startApplication = () => {
    setCurrentStep(1);
    formTracking.trackFormStart();
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    formTracking.trackFormSubmit();

    try {
      // Prepare data for anonymous submission (no user_id required)
      const submissionData = {
        // No user_id - this is an anonymous application
        shop_name: formData.shop_name,
        business_address_line_1: formData.business_address_line_1,
        business_address_line_2: formData.business_address_line_2,
        business_city: formData.business_city,
        business_state: formData.business_state,
        business_zip_code: formData.business_zip_code,
        business_country: formData.business_country,
        store_category: formData.store_category,
        store_type: formData.store_type,
        store_size: formData.store_size,
        years_in_business: formData.years_in_business,
        buyer_name: formData.buyer_name,
        buyer_email: formData.buyer_email,
        buyer_phone: formData.buyer_phone,
        pos_system: formData.pos_system,
        monthly_magazine_budget: formData.monthly_magazine_budget,
        preferred_delivery_frequency: formData.preferred_delivery_frequency,
        // Array fields - these should work with PostgreSQL ARRAY columns
        target_customers: formData.target_customers,
        aesthetic_preferences: formData.aesthetic_preferences,
        current_magazine_sources: formData.current_magazine_sources,
        interested_genres: formData.interested_genres,
        // Note: current_magazine_titles is ARRAY in DB but string in form - convert it
        current_magazine_titles: formData.current_magazine_titles ? [formData.current_magazine_titles] : [],
        status: 'pending' // Set default status
      };

      console.log('🔄 Retailer Application - Submitting data:', submissionData);

      const response = await fetch(`${config.supabase.url}/functions/v1/retailer-application`, {
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
      console.log('✅ Retailer Application submitted successfully:', result);

      // Store the application ID for the confirmation page
      setApplicationId(result.applicationId || 'N/A');

      // Email notification is handled automatically by database trigger

      // Track successful application submission
      trackApplicationSubmission('retailer', result.applicationId);

      // Show success toast
      toast.success('Application submitted successfully! We\'ll review it and get back to you soon.');

      // Go to confirmation page (step 6)
      setCurrentStep(6);
    } catch (error: any) {
      console.error('❌ Retailer Application submission error:', error);
      formTracking.trackFormError(error.message || 'Submission failed');
      toast.error(`Submission failed: ${error.message || 'An error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 10);
    if (digits.length > 6) return `(${p1}) ${p2}-${p3}`;
    if (digits.length > 3) return `(${p1}) ${p2}`;
    if (digits.length > 0) return `(${p1}`;
    return '';
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={styles.startingPageContainer}>
            <div className={styles.startingPageText}>
              <p>
                Neesh makes it simple for bookstores, galleries, cafes, and lifestyle shops to discover and stock independent magazines. Order in small quantities, return what does not sell, and access curated titles that fit your shelves.
Guaranteed returns on trial issues
              </p>

              <ul style={{ margin: '20px 0', paddingLeft: '20px' }}>
                <li>Browse by theme, region, or aesthetic to match your store’s character.</li>
                <li>Recover value by reselling overstock to other retailers.</li>
                <li>Save time with one platform for orders, payouts, and returns.</li>
                <li>Filling this out takes about <strong> 5 to 10 minutes </strong>.</li>
              </ul>

              {currentStep === 0 && (
        <p className={styles.alreadyAppliedText}>
          Already applied? You can submit additional store details using the same process.
        </p>
      )}
              <div className={styles.buttonContainer}>
                <button
                  onClick={startApplication}
                  className={styles.startButton}
                >
                  Start Application
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className={styles.magazineImageContainer}>
              <img
                src="/magazine-photo-white.jpg"
                alt="Independent magazine display"
                className={styles.magazineImage}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <motion.div
            className="space-y-8 step-1-selects"
            initial={{ opacity: 0, x: 20 }}j
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Store className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-semibold text-gray-800">Shop Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="shop_name" className="text-base font-semibold text-gray-700">
                  Shop Name 
                </Label>
                <Input
                  id="shop_name"
                  value={formData.shop_name}
                  onChange={(e) => handleInputChange('shop_name', e.target.value)}
                  placeholder="Your store name"
                  className={`w-full p-4 text-base border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                    errors.shop_name ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.shop_name && <p className="text-sm text-red-600 mt-1">{errors.shop_name}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-700">Store Category *</Label>
                <div
                  className={styles.selectField}
                  style={{ marginBottom: openDropdowns.category ? '245px' : '0' }}
                >
                  <Select
                    value={formData.store_category}
                    onValueChange={(value: string) => handleInputChange('store_category', value)}
                    onOpenChange={(open: boolean) => setOpenDropdowns(prev => ({ ...prev, category: open }))}
                  >
                  <SelectTrigger className={`${styles.selectTrigger} w-full h-12 px-4 text-base border-2 rounded-lg justify-between ${errors.store_category ? 'border-red-500' : 'border-gray-200'}`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    sideOffset={8}
                    className="z-50"
                  >
                    {STORE_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>
                {errors.store_category && <p className="text-sm text-red-600 mt-1">{errors.store_category}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-700">Store Type *</Label>
                <div
                  className={styles.selectField}
                  style={{ marginBottom: openDropdowns.type ? '150px' : '0' }}
                >
                  <Select
                    value={formData.store_type}
                    onValueChange={(value: string) => handleInputChange('store_type', value)}
                    onOpenChange={(open: boolean) => setOpenDropdowns(prev => ({ ...prev, type: open }))}
                  >
                    <SelectTrigger className={`${styles.selectTrigger} w-full h-12 px-4 text-base border-2 rounded-lg justify-between ${errors.store_type ? 'border-red-500' : 'border-gray-200'}`}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={8} className="z-50">
                      {STORE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.store_type && <p className="text-sm text-red-600 mt-1">{errors.store_type}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-700">Store Size *</Label>
                <div
                  className={styles.selectField}
                  style={{ marginBottom: openDropdowns.size ? '120px' : '0' }}
                >
                  <Select
                    value={formData.store_size}
                    onValueChange={(value: string) => handleInputChange('store_size', value)}
                    onOpenChange={(open: boolean) => setOpenDropdowns(prev => ({ ...prev, size: open }))}
                  >
                    <SelectTrigger className={`${styles.selectTrigger} w-full h-12 px-4 text-base border-2 rounded-lg justify-between ${errors.store_size ? 'border-red-500' : 'border-gray-200'}`}>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" sideOffset={8} className="z-50">
                      {STORE_SIZES.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.store_size && <p className="text-sm text-red-600 mt-1">{errors.store_size}</p>}
              </div>
            </div>



            <div className="space-y-3">
              <Label htmlFor="years_in_business" className="text-base font-semibold text-gray-700">
                Years in Business
              </Label>
              <Input
                id="years_in_business"
                type="number"
                value={formData.years_in_business || ''}
                onChange={(e) => handleInputChange('years_in_business', parseInt(e.target.value) || 0)}
                placeholder="e.g., 3"
                className="w-full p-4 text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <MapPin className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-semibold text-gray-800">Business Address</h3>
            </div>

            <div className="space-y-3">
              <Label htmlFor="business_address_line_1" className="text-base font-semibold text-gray-700">
                Address Line 1 *
              </Label>
              <Input
                id="business_address_line_1"
                value={formData.business_address_line_1}
                onChange={(e) => handleInputChange('business_address_line_1', e.target.value)}
                placeholder="Street address"
                className={`w-full p-4 text-base border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                  errors.business_address_line_1 ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.business_address_line_1 && <p className="text-sm text-red-600 mt-1">{errors.business_address_line_1}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_address_line_2" className="text-sm font-semibold text-gray-700">
                Address Line 2
              </Label>
              <Input
                id="business_address_line_2"
                value={formData.business_address_line_2}
                onChange={(e) => handleInputChange('business_address_line_2', e.target.value)}
                placeholder="Apartment, suite, etc. (optional)"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="business_city" className="text-sm font-semibold text-gray-700">
                  City *
                </Label>
                <Input
                  id="business_city"
                  value={formData.business_city}
                  onChange={(e) => handleInputChange('business_city', e.target.value)}
                  placeholder="City"
                  className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                    errors.business_city ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.business_city && <p className="text-sm text-red-600">{errors.business_city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_state" className="text-sm font-semibold text-gray-700">
                  State *
                </Label>
                <Input
                  id="business_state"
                  value={formData.business_state}
                  onChange={(e) => handleInputChange('business_state', e.target.value)}
                  placeholder="State"
                  className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                    errors.business_state ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.business_state && <p className="text-sm text-red-600">{errors.business_state}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_zip_code" className="text-sm font-semibold text-gray-700">
                  ZIP Code *
                </Label>
                <Input
                  id="business_zip_code"
                  value={formData.business_zip_code}
                  onChange={(e) => handleInputChange('business_zip_code', e.target.value)}
                  placeholder="ZIP"
                  className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                    errors.business_zip_code ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.business_zip_code && <p className="text-sm text-red-600">{errors.business_zip_code}</p>}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="buyer_name" className="text-sm font-semibold text-gray-700">
                  Buyer Name *
                </Label>
                <Input
                  id="buyer_name"
                  value={formData.buyer_name}
                  onChange={(e) => handleInputChange('buyer_name', e.target.value)}
                  placeholder="Full name"
                  className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                    errors.buyer_name ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.buyer_name && <p className="text-sm text-red-600">{errors.buyer_name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyer_email" className="text-sm font-semibold text-gray-700">
                  Email Address *
                </Label>
                <Input
                  id="buyer_email"
                  type="email"
                  value={formData.buyer_email}
                  onChange={(e) => handleInputChange('buyer_email', e.target.value)}
                  placeholder="email@example.com"
                  className={`w-full p-3 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                    errors.buyer_email ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.buyer_email && <p className="text-sm text-red-600">{errors.buyer_email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyer_phone" className="text-sm font-semibold text-gray-700">
                Phone Number
              </Label>
              <Input
                id="buyer_phone"
                value={formData.buyer_phone}
                onChange={(e) => handleInputChange('buyer_phone', formatPhone(e.target.value))}
                placeholder="(555) 123-4567"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">Store Profile</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">Target Customers *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TARGET_CUSTOMERS.map(customer => (
                    <div key={customer} className="flex items-center space-x-2">
                      <Checkbox
                        id={`customer-${customer}`}
                        checked={formData.target_customers.includes(customer)}
                        onCheckedChange={() => handleArrayToggle('target_customers', customer)}
                      />
                      <Label htmlFor={`customer-${customer}`} className="text-sm cursor-pointer">
                        {customer}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.target_customers && <p className="text-sm text-red-600">{errors.target_customers}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">Store Aesthetic *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AESTHETIC_PREFERENCES.map(aesthetic => (
                    <div key={aesthetic} className="flex items-center space-x-2">
                      <Checkbox
                        id={`aesthetic-${aesthetic}`}
                        checked={formData.aesthetic_preferences.includes(aesthetic)}
                        onCheckedChange={() => handleArrayToggle('aesthetic_preferences', aesthetic)}
                      />
                      <Label htmlFor={`aesthetic-${aesthetic}`} className="text-sm cursor-pointer">
                        {aesthetic}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.aesthetic_preferences && <p className="text-sm text-red-600">{errors.aesthetic_preferences}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">Interested Genres</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {INTERESTED_GENRES.map(genre => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre}`}
                        checked={formData.interested_genres.includes(genre)}
                        onCheckedChange={() => handleArrayToggle('interested_genres', genre)}
                      />
                      <Label htmlFor={`genre-${genre}`} className="text-sm cursor-pointer">
                        {genre}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">Business Operations</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-700">POS System</Label>
                <div
                  className={styles.selectField}
                  style={{ marginBottom: openDropdowns.pos ? '175px' : '0' }}
                >
                  <Select
                    value={formData.pos_system}
                    onValueChange={(value: string) => handleInputChange('pos_system', value)}
                    onOpenChange={(open: boolean) => setOpenDropdowns(prev => ({ ...prev, pos: open }))}
                  >
                    <SelectTrigger className={`${styles.selectTrigger} w-full h-12 px-4 text-base border-2 rounded-lg justify-between border-gray-200`}>
                      <SelectValue placeholder="Select POS system" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      side="bottom"
                      sideOffset={8}
                      className="z-50"
                    >
                      {POS_SYSTEMS.map(system => (
                        <SelectItem key={system} value={system}>{system}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-700">Preferred Delivery Frequency</Label>
                <div
                  className={styles.selectField}
                  style={{ marginBottom: openDropdowns.frequency ? '125px' : '0' }}
                >
                  <Select
                    value={formData.preferred_delivery_frequency}
                    onValueChange={(value: string) => handleInputChange('preferred_delivery_frequency', value)}
                    onOpenChange={(open: boolean) => setOpenDropdowns(prev => ({ ...prev, frequency: open }))}
                  >
                    <SelectTrigger className={`${styles.selectTrigger} w-full h-12 px-4 text-base border-2 rounded-lg justify-between border-gray-200`}>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      side="bottom"
                      sideOffset={8}
                      className="z-50"
                    >
                      {DELIVERY_FREQUENCIES.map(frequency => (
                        <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_magazine_budget" className="text-sm font-semibold text-gray-700">
                Monthly Magazine Budget ($)
              </Label>
              <Input
                id="monthly_magazine_budget"
                type="number"
                value={formData.monthly_magazine_budget || ''}
                onChange={(e) => handleInputChange('monthly_magazine_budget', parseInt(e.target.value) || 0)}
                placeholder="e.g., 500"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Current Magazine Sources</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {MAGAZINE_SOURCES.map(source => (
                  <div key={source} className="flex items-center space-x-2">
                    <Checkbox
                      id={`source-${source}`}
                      checked={formData.current_magazine_sources.includes(source)}
                      onCheckedChange={() => handleArrayToggle('current_magazine_sources', source)}
                    />
                    <Label htmlFor={`source-${source}`} className="text-sm cursor-pointer">
                      {source}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_magazine_titles" className="text-sm font-semibold text-gray-700">
                Current Magazine Titles
              </Label>
              <Textarea
                id="current_magazine_titles"
                value={formData.current_magazine_titles}
                onChange={(e) => handleInputChange('current_magazine_titles', e.target.value)}
                placeholder="List magazines you currently stock (comma-separated)"
                rows={3}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
              />
            </div>
          </motion.div>
        );

      case 6:
        return (
          <div className="space-y-8 text-center" style={{ padding: '25px' }}>
            <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-3xl text-white" style={{ position: 'relative', bottom: '20px' }}>
                ✓
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800" style={{ position: 'relative', bottom: '25px' }}>
              Application Submitted Successfully!
            </h3>
            <div className="space-y-4 max-w-2xl mx-auto">
              <p className="text-gray-600" style={{ position: 'relative', bottom: '20px' }}>
                <strong>Application ID:</strong> {applicationId}
              </p>
              <p className="text-gray-600" style={{ position: 'relative', bottom: '20px' }}>
                We've received your retailer application and will review it carefully.
              </p>
              <p className="text-gray-600" style={{ position: 'relative', bottom: '20px' }}>
                You'll hear from us within 2–3 business days with next steps.
                If we have questions, we'll reach out directly.
              </p>
              <p className="text-gray-600" style={{ position: 'relative', bottom: '11px' }}>
                In the meantime, keep an eye on your inbox at <strong>{formData.buyer_email}</strong>.
              </p>
            </div>
            <Button
              onClick={() => window.location.href = '/retailer-dashboard-coming-soon'}
              className="bg-black text-white border-none hover:bg-gray-800"
            >
              Return to Dashboard
            </Button>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">Step {currentStep}</h3>
            <p className="text-gray-600">This step is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div className={styles.applicationContainer} style={{ flex: 1 }}>
        <div className={styles.applicationCard}>
          {/* Header inside the card but without padding */}
          <div className={styles.applicationHeader}>
            <h1 className={styles.applicationTitle}>
              Stock indie magazines with confidence and clarity
            </h1>
          </div>

        {/* Progress - Hide on confirmation page */}
        {currentStep > 0 && currentStep !== 6 && (
          <div className={styles.progressContainer}>
            <div className="flex justify-between text-gray-600 mb-3">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-medium">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-700" />
          </div>
        )}

        {/* Content */}
        {currentStep === 0 ? (
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        ) : (
          <div className="px-6 md:px-12 py-12">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation - Hide on confirmation page */}
            {currentStep !== 6 && (
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="flex items-center gap-2 px-8 py-3 text-base font-medium min-w-[120px] h-12"
              >
              <ChevronLeft className="h-5 w-5" />
              Back
            </Button>

            {currentStep < 5 ? (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 text-base font-medium min-w-[120px] h-12 bg-black hover:bg-gray-800"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </Button>
            ) : currentStep === 5 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-10 py-3 text-base font-medium min-w-[180px] h-12 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                Submit Application
              </Button>
            ) : null}
            </div>
            )}
          </div>
        )}
      </div>
      
      </div>

      <Footer />
    </div>
  );
};

// Retailer Application Form Component
export default RetailerApplicationForm;
