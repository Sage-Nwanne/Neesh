import { ApplicationConfirmation } from './ApplicationConfirmation';

// Application data structure for the publisher application form
// This defines the shape of data collected through the multi-step form
const defaultApplicationData = {
  // User Account Information
  email: '',

  // Personal Information
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
};

export default function PublisherApplication() {
  return <ApplicationConfirmation />;
}
