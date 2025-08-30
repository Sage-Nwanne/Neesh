// Core application types

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'publisher' | 'retailer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Publisher extends User {
  role: 'publisher';
  businessName?: string;
  businessType?: string;
  taxId?: string;
}

export interface Retailer extends User {
  role: 'retailer';
  storeName: string;
  storeAddress: string;
  businessLicense?: string;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Application form types
export interface ApplicationData {
  // Personal Information
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  
  // Address Information
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Publishing Information
  publishingExperience: string;
  genres: string[];
  previousPublications: string;
  manuscriptTitle: string;
  manuscriptGenre: string;
  manuscriptWordCount: number;
  manuscriptSynopsis: string;
  
  // Business Information
  businessName?: string;
  businessType?: string;
  taxId?: string;
  
  // Marketing Information
  targetAudience: string;
  marketingPlan: string;
  socialMediaPresence: string;
  
  // Legal Information
  copyrightOwnership: boolean;
  previousContracts: boolean;
  
  // File Uploads
  manuscriptFile?: File;
  coverLetter?: File;
  authorBio?: File;
  marketingMaterials?: File[];
}

// Magazine/Product types
export interface Magazine {
  id: string;
  title: string;
  description: string;
  publisherId: string;
  publisher: Publisher;
  price: number;
  wholesalePrice: number;
  category: string;
  tags: string[];
  coverImageUrl: string;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface Order {
  id: string;
  retailerId: string;
  retailer: Retailer;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  magazineId: string;
  magazine: Magazine;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Form step types
export interface FormStep {
  id: number;
  title: string;
  description: string;
  isComplete?: boolean;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  requiresAuth?: boolean;
  roles?: User['role'][];
}

// Dashboard stats types
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
}
