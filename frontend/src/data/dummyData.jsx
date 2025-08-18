// Products/Magazines data
export const productsData = [
  {
    id: 1,
    title: "Modern Living",
    category: "lifestyle",
    price: 8.99,
    status: "Active",
    stock: 150,
    sold: 89,
    revenue: 801.11,
    coverImage: "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "A contemporary lifestyle magazine focusing on modern home design and urban living.",
    created_at: "2023-01-15",
    last_updated: "2023-06-10"
  },
  {
    id: 2,
    title: "Home Design Quarterly",
    category: "lifestyle",
    price: 9.99,
    status: "Active",
    stock: 200,
    sold: 156,
    revenue: 1558.44,
    coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Quarterly publication featuring the latest trends in interior design and architecture.",
    created_at: "2023-02-20",
    last_updated: "2023-06-08"
  },
  {
    id: 3,
    title: "Outdoor Living",
    category: "lifestyle",
    price: 7.99,
    status: "Draft",
    stock: 0,
    sold: 0,
    revenue: 0,
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description: "Explore outdoor spaces, gardening tips, and sustainable living practices.",
    created_at: "2023-06-01",
    last_updated: "2023-06-12"
  }
];

// Analytics data
export const analyticsData = {
  revenue: {
    total_this_month: 12847.50,
    growth_rate: 15.3,
    best_selling_product: "Modern Living Magazine",
    monthly: [
      { month: "Jan", amount: 2100 },
      { month: "Feb", amount: 2300 },
      { month: "Mar", amount: 2800 },
      { month: "Apr", amount: 2650 },
      { month: "May", amount: 2900 },
      { month: "Jun", amount: 3200 }
    ]
  },
  traffic: {
    page_views: 45678,
    unique_visitors: 12456,
    conversion_rate: 3.2
  },
  top_products: [
    { name: "Modern Living", sales: 156, revenue: 1558.44 },
    { name: "Home Design Quarterly", sales: 134, revenue: 1338.66 },
    { name: "Outdoor Living", sales: 98, revenue: 783.02 },
    { name: "Tech Today", sales: 87, revenue: 695.13 },
    { name: "Health & Wellness", sales: 76, revenue: 608.24 }
  ]
};

// Admin-specific dummy data
export const adminFlaggedContentData = [
  {
    id: 1,
    type: "magazine",
    title: "Controversial Topics Weekly",
    publisher: "Edge Publications",
    reason: "Inappropriate content reported by retailers",
    flagged_by: "Multiple retailers",
    flagged_at: "2023-06-19T16:30:00Z",
    status: "under_review",
    severity: "high"
  },
  {
    id: 2,
    type: "review",
    title: "Review of Modern Living Magazine",
    reviewer: "Anonymous User",
    reason: "Spam/fake review suspected",
    flagged_by: "Automated system",
    flagged_at: "2023-06-18T12:45:00Z",
    status: "pending",
    severity: "medium"
  }
];

// Retailer data
export const retailerOrdersData = [
  {
    id: "ord_001",
    magazine_id: 1,
    magazines: {
      title: "Modern Living",
      cover_image_url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    },
    quantity: 25,
    total_price: "224.75",
    status: "delivered",
    created_at: "2023-06-15T10:30:00Z"
  }
];

export const retailerInventoryData = [
  {
    id: 1,
    magazine_id: 1,
    quantity: 18,
    status: "in_stock",
    magazine: {
      title: "Modern Living",
      category: "lifestyle",
      cover_image_url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    }
  }
];

export const availableMagazinesData = [
  {
    id: 1,
    title: "Modern Living",
    price: 8.99,
    category: "lifestyle",
    description: "A contemporary lifestyle magazine focusing on modern home design and urban living.",
    cover_image_url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    users: { username: "DesignStudio" }
  }
];

export const adminSubmissionsData = [
  {
    id: 1,
    title: "Tech Weekly Magazine",
    publisher: "TechCorp Publishing",
    category: "technology",
    status: "pending",
    submitted_at: "2023-06-20T10:30:00Z",
    description: "A weekly magazine covering the latest in technology trends and innovations.",
    cover_image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    title: "Culinary Arts Monthly",
    publisher: "Food & Flavor Publications",
    category: "food",
    status: "approved",
    submitted_at: "2023-06-18T14:15:00Z",
    description: "Monthly publication featuring recipes, chef interviews, and culinary techniques.",
    cover_image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    title: "Urban Photography",
    publisher: "Street Vision Media",
    category: "photography",
    status: "rejected",
    submitted_at: "2023-06-15T09:45:00Z",
    description: "Showcasing urban photography and street art from around the world.",
    cover_image_url: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  }
];

// Add this export for admin orders data
export const adminOrdersData = [
  {
    id: "ord_001",
    magazine_title: "Modern Living",
    publisher_name: "DesignStudio",
    retailer_name: "Urban Books",
    quantity: 25,
    total_amount: "224.75",
    status: "pending",
    created_at: "2023-06-15T10:30:00Z"
  },
  {
    id: "ord_002",
    magazine_title: "Home Design Quarterly",
    publisher_name: "Interior Press",
    retailer_name: "City Magazine Shop",
    quantity: 15,
    total_amount: "149.85",
    status: "processing",
    created_at: "2023-06-14T14:20:00Z"
  },
  {
    id: "ord_003",
    magazine_title: "Tech Weekly",
    publisher_name: "TechCorp Publishing",
    retailer_name: "Digital Reads",
    quantity: 30,
    total_amount: "359.70",
    status: "shipped",
    created_at: "2023-06-13T09:15:00Z"
  }
];

// Add customers data export
export const customersData = [
  {
    id: 1,
    name: "Urban Books & Coffee",
    email: "orders@urbanbooksandcoffee.com",
    type: "Independent Bookstore",
    location: "Portland, OR",
    total_orders: 24,
    total_spent: 2847.50,
    avg_order_value: 118.65,
    rating: 4.8,
    status: "Active"
  },
  {
    id: 2,
    name: "City Magazine Shop",
    email: "purchasing@citymagshop.com",
    type: "Magazine Retailer",
    location: "New York, NY",
    total_orders: 18,
    total_spent: 1956.75,
    avg_order_value: 108.71,
    rating: 4.6,
    status: "Active"
  },
  {
    id: 3,
    name: "Corner Newsstand",
    email: "manager@cornernews.com",
    type: "Newsstand",
    location: "Chicago, IL",
    total_orders: 32,
    total_spent: 3245.80,
    avg_order_value: 101.43,
    rating: 4.4,
    status: "Active"
  },
  {
    id: 4,
    name: "Literary Lounge",
    email: "books@literarylounge.com",
    type: "Independent Bookstore",
    location: "San Francisco, CA",
    total_orders: 15,
    total_spent: 1678.25,
    avg_order_value: 111.88,
    rating: 4.9,
    status: "Active"
  },
  {
    id: 5,
    name: "Metro Books",
    email: "orders@metrobooks.com",
    type: "Chain Store",
    location: "Los Angeles, CA",
    total_orders: 45,
    total_spent: 4892.30,
    avg_order_value: 108.72,
    rating: 4.2,
    status: "Active"
  }
];

// Add widgets data export
export const widgetsData = [
  {
    id: 1,
    title: "Revenue Chart",
    type: "chart",
    size: "medium",
    active: true,
    data: {
      values: [2100, 2300, 2800, 2650, 2900, 3200],
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    }
  },
  {
    id: 2,
    title: "Top Customers",
    type: "list",
    size: "medium",
    active: true,
    data: [
      { name: "Urban Books & Coffee", location: "Portland, OR", total_spent: 2847.50 },
      { name: "City Magazine Shop", location: "New York, NY", total_spent: 1956.75 },
      { name: "Corner Newsstand", location: "Chicago, IL", total_spent: 3245.80 }
    ]
  },
  {
    id: 3,
    title: "Revenue Goal",
    type: "progress",
    size: "small",
    active: true,
    data: {
      current: 12847,
      target: 15000,
      percentage: 86
    }
  },
  {
    id: 4,
    title: "Recent Activity",
    type: "feed",
    size: "medium",
    active: false,
    data: [
      { action: "New order from Urban Books", time: "2 hours ago" },
      { action: "Magazine approved", time: "4 hours ago" },
      { action: "Payment received", time: "6 hours ago" }
    ]
  }
];

// Add reports data export
export const reportsData = [
  {
    id: 1,
    name: "Monthly Sales Report",
    type: "Sales",
    period: "June 2023",
    generated: "2023-06-30",
    status: "Ready",
    file_size: "2.4 MB",
    download_url: "#"
  },
  {
    id: 2,
    name: "Customer Analysis",
    type: "Customers",
    period: "Q2 2023",
    generated: "2023-06-28",
    status: "Ready",
    file_size: "1.8 MB",
    download_url: "#"
  },
  {
    id: 3,
    name: "Product Performance",
    type: "Products",
    period: "May 2023",
    generated: "2023-06-25",
    status: "Processing",
    file_size: "0 MB",
    download_url: "#"
  },
  {
    id: 4,
    name: "Financial Summary",
    type: "Financial",
    period: "Q2 2023",
    generated: "Scheduled",
    status: "Scheduled",
    file_size: "N/A",
    download_url: "#"
  }
];

// Messages data (if Messages.jsx needs it)
export const messagesData = [
  {
    id: 1,
    sender: "Urban Books",
    subject: "Order Inquiry",
    message: "When will our next shipment arrive?",
    timestamp: "2023-06-20T10:30:00Z",
    read: false
  },
  {
    id: 2,
    sender: "Admin",
    subject: "Magazine Approved",
    message: "Your magazine submission has been approved.",
    timestamp: "2023-06-19T14:15:00Z",
    read: true
  }
];

// Partners data (if Partners.jsx needs it)
export const partnersData = [
  {
    id: 1,
    name: "Independent Publishers Alliance",
    type: "Publisher Network",
    status: "Active",
    joined: "2023-01-15"
  },
  {
    id: 2,
    name: "Retail Magazine Network",
    type: "Retailer Network", 
    status: "Active",
    joined: "2023-02-20"
  }
];

// Orders data (if Orders.jsx needs it)
export const ordersData = [
  {
    id: "ord_001",
    customer: "Urban Books",
    total: 224.75,
    status: "pending",
    date: "2023-06-20"
  },
  {
    id: "ord_002", 
    customer: "City Magazine Shop",
    total: 149.85,
    status: "shipped",
    date: "2023-06-19"
  }
];

// Marketplace data (if Marketplace.jsx needs it)
export const marketplaceData = [
  {
    id: 1,
    title: "Modern Living",
    price: 8.99,
    category: "lifestyle",
    publisher: "DesignStudio",
    rating: 4.8
  },
  {
    id: 2,
    title: "Tech Weekly",
    price: 12.99,
    category: "technology", 
    publisher: "TechCorp",
    rating: 4.6
  }
];

// Notifications data (if Notifications.jsx needs it)
export const notificationsData = [
  {
    id: 1,
    title: "New Order Received",
    message: "Urban Books placed an order for 25 magazines",
    timestamp: "2023-06-20T10:30:00Z",
    read: false,
    type: "order"
  },
  {
    id: 2,
    title: "Payment Processed",
    message: "Payment of $224.75 has been processed",
    timestamp: "2023-06-19T14:15:00Z", 
    read: true,
    type: "payment"
  }
];
