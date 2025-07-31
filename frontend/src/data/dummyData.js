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

// Customers/Retailers data
export const customersData = [
  {
    id: 101,
    name: "City Books",
    email: "orders@citybooks.com",
    location: "New York, NY",
    type: "Independent Bookstore",
    total_orders: 12,
    total_spent: 1247.85,
    avg_order_value: 103.99,
    last_order: "2023-06-15",
    status: "Active",
    rating: 4.8,
    join_date: "2022-08-15"
  },
  {
    id: 102,
    name: "Magazine World",
    email: "purchasing@magworld.com",
    location: "Los Angeles, CA",
    type: "Magazine Retailer",
    total_orders: 8,
    total_spent: 892.40,
    avg_order_value: 111.55,
    last_order: "2023-06-10",
    status: "Active",
    rating: 4.6,
    join_date: "2022-11-03"
  },
  {
    id: 103,
    name: "Read & Co.",
    email: "info@readandco.com",
    location: "Chicago, IL",
    type: "Boutique Store",
    total_orders: 15,
    total_spent: 1654.20,
    avg_order_value: 110.28,
    last_order: "2023-06-05",
    status: "Active",
    rating: 4.9,
    join_date: "2022-06-20"
  },
  {
    id: 104,
    name: "Green Pages",
    email: "orders@greenpages.com",
    location: "Portland, OR",
    type: "Eco-Friendly Store",
    total_orders: 6,
    total_spent: 567.30,
    avg_order_value: 94.55,
    last_order: "2023-05-25",
    status: "Inactive",
    rating: 4.4,
    join_date: "2023-01-10"
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

// Widgets data
export const widgetsData = [
  {
    id: 1,
    title: "Revenue Chart",
    type: "chart",
    size: "large",
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
      { name: "City Books", location: "New York", total_spent: 2847.50 },
      { name: "Magazine World", location: "Los Angeles", total_spent: 2156.75 },
      { name: "Read & Co.", location: "Chicago", total_spent: 1923.25 }
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
      target: 18000,
      percentage: 70
    }
  },
  {
    id: 4,
    title: "Recent Activity",
    type: "feed",
    size: "medium",
    active: true,
    data: [
      { action: "New order from City Books", time: "2 hours ago" },
      { action: "Payment received", time: "4 hours ago" },
      { action: "Magazine published", time: "1 day ago" }
    ]
  },
  {
    id: 5,
    title: "Custom Widget",
    type: "custom",
    size: "small",
    active: false,
    data: {}
  }
];

// Reports data
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
    period: "June 2023",
    generated: "2023-06-25",
    status: "Processing",
    file_size: "3.1 MB",
    download_url: "#"
  },
  {
    id: 4,
    name: "Revenue Breakdown",
    type: "Financial",
    period: "May 2023",
    generated: "2023-05-31",
    status: "Ready",
    file_size: "1.2 MB",
    download_url: "#"
  }
];

// Publisher's magazines for dashboard
export const publisherMagazines = [
  {
    id: 1,
    title: "Modern Living",
    category: "lifestyle",
    price: 8.99,
    status: "Active",
    coverImage: "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    title: "Home Design Quarterly",
    category: "lifestyle", 
    price: 9.99,
    status: "Active",
    coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    title: "Outdoor Living",
    category: "lifestyle",
    price: 7.99,
    status: "Draft",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  }
];

// Publisher's sales data
export const publisherSales = [
  {
    id: 1,
    date: "2023-06-15",
    magazineTitle: "Modern Living",
    retailerId: 101,
    retailerName: "City Books",
    quantity: 25,
    amount: 224.75,
    status: "completed"
  },
  {
    id: 2,
    date: "2023-06-10", 
    magazineTitle: "Home Design Quarterly",
    retailerId: 102,
    retailerName: "Magazine World",
    quantity: 15,
    amount: 149.85,
    status: "completed"
  },
  {
    id: 3,
    date: "2023-06-05",
    magazineTitle: "Modern Living", 
    retailerId: 103,
    retailerName: "Read & Co.",
    quantity: 20,
    amount: 179.80,
    status: "processing"
  },
  {
    id: 4,
    date: "2023-05-28",
    magazineTitle: "Home Design Quarterly",
    retailerId: 101,
    retailerName: "City Books", 
    quantity: 10,
    amount: 99.90,
    status: "completed"
  },
  {
    id: 5,
    date: "2023-05-25",
    magazineTitle: "Outdoor Living",
    retailerId: 104,
    retailerName: "Green Pages",
    quantity: 30,
    amount: 239.70,
    status: "processing"
  }
];
