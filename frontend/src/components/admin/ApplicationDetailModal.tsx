import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Download, User, Building, Mail, Phone, MapPin, Calendar, DollarSign, Package, Truck } from 'lucide-react';
import { Application } from '../../services/adminApi';

interface ApplicationDetailModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, type: 'publisher' | 'retailer') => void;
  onDeny: (id: string, type: 'publisher' | 'retailer', reason?: string) => void;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  onApprove,
  onDeny
}) => {
  const [denialReason, setDenialReason] = useState('');
  const [showDenialForm, setShowDenialForm] = useState(false);

  if (!isOpen || !application) return null;

  const handleDeny = () => {
    if (showDenialForm) {
      onDeny(application.id, application.type, denialReason);
      setShowDenialForm(false);
      setDenialReason('');
      onClose();
    } else {
      setShowDenialForm(true);
    }
  };

  const handleApprove = () => {
    onApprove(application.id, application.type);
    onClose();
  };

  const renderPublisherDetails = () => {
    const data = application.applicationData;
    
    return (
      <div className="space-y-6">
        {/* Account Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <User className="mr-2" size={20} />
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">First Name</label>
              <p className="text-gray-900">{data.first_name || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Last Name</label>
              <p className="text-gray-900">{data.last_name || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900 flex items-center">
                <Mail className="mr-1" size={16} />
                {data.email || '—'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Business Name</label>
              <p className="text-gray-900 flex items-center">
                <Building className="mr-1" size={16} />
                {data.business_name || '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Magazine Details */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Package className="mr-2" size={20} />
            Magazine Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Magazine Title</label>
              <p className="text-gray-900 font-medium">{data.magazine_title || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Publication Type</label>
              <p className="text-gray-900">{data.publication_type || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Issue Number</label>
              <p className="text-gray-900">{data.issue_number || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Issue Frequency</label>
              <p className="text-gray-900">{data.issue_frequency || '—'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Description</label>
              <p className="text-gray-900">{data.description || '—'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Social/Website Link</label>
              <p className="text-gray-900">{data.social_website_link || '—'}</p>
            </div>
          </div>
        </div>

        {/* Print & Pricing */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <DollarSign className="mr-2" size={20} />
            Print & Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Print Run</label>
              <p className="text-gray-900">{data.print_run || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Available Quantity</label>
              <p className="text-gray-900">{data.available_quantity || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Wholesale Price</label>
              <p className="text-gray-900">${data.wholesale_price || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Suggested Retail Price</label>
              <p className="text-gray-900">${data.suggested_retail_price || '—'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Specifications</label>
              <p className="text-gray-900">{data.specs || '—'}</p>
            </div>
          </div>
        </div>

        {/* Fulfillment */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Truck className="mr-2" size={20} />
            Fulfillment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Fulfillment Method</label>
              <p className="text-gray-900">{data.fulfillment_method || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Shipping Location</label>
              <p className="text-gray-900 flex items-center">
                <MapPin className="mr-1" size={16} />
                {data.shipping_city && data.shipping_state 
                  ? `${data.shipping_city}, ${data.shipping_state}, ${data.shipping_country || 'US'}`
                  : '—'
                }
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Return Policy</label>
              <p className="text-gray-900">{data.return_policy || '—'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRetailerDetails = () => {
    const data = application.applicationData;
    
    return (
      <div className="space-y-6">
        {/* Contact Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <User className="mr-2" size={20} />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Buyer Name</label>
              <p className="text-gray-900">{data.buyer_name || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email Address</label>
              <p className="text-gray-900 flex items-center">
                <Mail className="mr-1" size={16} />
                {data.buyer_email || '—'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone Number</label>
              <p className="text-gray-900 flex items-center">
                <Phone className="mr-1" size={16} />
                {data.buyer_phone || '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Shop Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Building className="mr-2" size={20} />
            Shop Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Shop Name</label>
              <p className="text-gray-900 font-medium">{data.shop_name || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Store Category</label>
              <p className="text-gray-900">{data.store_category || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Store Type</label>
              <p className="text-gray-900">{data.store_type || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Store Size</label>
              <p className="text-gray-900">{data.store_size || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Years in Business</label>
              <p className="text-gray-900">{data.years_in_business || '—'}</p>
            </div>
          </div>
        </div>

        {/* Business Address */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <MapPin className="mr-2" size={20} />
            Business Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Address Line 1</label>
              <p className="text-gray-900">{data.business_address_line_1 || '—'}</p>
            </div>
            {data.business_address_line_2 && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Address Line 2</label>
                <p className="text-gray-900">{data.business_address_line_2}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-600">City</label>
              <p className="text-gray-900">{data.business_city || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">State</label>
              <p className="text-gray-900">{data.business_state || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">ZIP Code</label>
              <p className="text-gray-900">{data.business_zip_code || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Country</label>
              <p className="text-gray-900">{data.business_country || '—'}</p>
            </div>
          </div>
        </div>

        {/* Business Operations */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <DollarSign className="mr-2" size={20} />
            Business Operations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">POS System</label>
              <p className="text-gray-900">{data.pos_system || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Monthly Magazine Budget</label>
              <p className="text-gray-900">${data.monthly_magazine_budget || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Preferred Delivery Frequency</label>
              <p className="text-gray-900">{data.preferred_delivery_frequency || '—'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Current Magazine Sources</label>
              <p className="text-gray-900">
                {data.current_magazine_sources && Array.isArray(data.current_magazine_sources) 
                  ? data.current_magazine_sources.join(', ') 
                  : '—'
                }
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Target Customers</label>
              <p className="text-gray-900">
                {data.target_customers && Array.isArray(data.target_customers) 
                  ? data.target_customers.join(', ') 
                  : '—'
                }
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">Aesthetic Preferences</label>
              <p className="text-gray-900">
                {data.aesthetic_preferences && Array.isArray(data.aesthetic_preferences) 
                  ? data.aesthetic_preferences.join(', ') 
                  : '—'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {application.type === 'publisher' ? 'Publisher' : 'Retailer'} Application Details
            </h2>
            <p className="text-gray-600 mt-1">
              {application.applicantName} • {application.businessName}
            </p>
            <div className="flex items-center mt-2 space-x-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                application.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {application.status}
              </span>
              <span className="text-sm text-gray-500 flex items-center">
                <Calendar className="mr-1" size={14} />
                Submitted: {new Date(application.submittedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {application.type === 'publisher' ? renderPublisherDetails() : renderRetailerDetails()}
        </div>

        {/* Footer Actions */}
        {application.status === 'pending' && (
          <div className="border-t p-6 bg-gray-50">
            {showDenialForm ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for denial (optional)
                  </label>
                  <textarea
                    value={denialReason}
                    onChange={(e) => setDenialReason(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Provide feedback to help the applicant improve their submission..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDenialForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeny}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <XCircle className="mr-2" size={16} />
                    Confirm Rejection
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeny}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <XCircle className="mr-2" size={16} />
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <CheckCircle className="mr-2" size={16} />
                  Accept
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailModal;
