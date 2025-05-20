// Magazine data for the home page
export const magazineData = [
  {
    id: 1,
    title: "Modern Living",
    publisher: "Home & Style Publications",
    category: "lifestyle",
    price: 8.99,
    coverImage: "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    title: "Tech Today",
    publisher: "Digital Media Group",
    category: "tech",
    price: 7.50,
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 3,
    title: "Gourmet Kitchen",
    publisher: "Culinary Press",
    category: "food",
    price: 9.99,
    coverImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 4,
    title: "Fashion Forward",
    publisher: "Style House",
    category: "fashion",
    price: 12.99,
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 5,
    title: "Wanderlust",
    publisher: "Adventure Media",
    category: "travel",
    price: 10.50,
    coverImage: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 6,
    title: "Home Design",
    publisher: "Interior Collective",
    category: "lifestyle",
    price: 8.99,
    coverImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
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
    status: "Completed"
  },
  {
    id: 2,
    date: "2023-06-10",
    magazineTitle: "Home Design Quarterly",
    retailerId: 102,
    retailerName: "Magazine World",
    quantity: 15,
    amount: 149.85,
    status: "Completed"
  },
  {
    id: 3,
    date: "2023-06-05",
    magazineTitle: "Modern Living",
    retailerId: 103,
    retailerName: "Read & Co.",
    quantity: 20,
    amount: 179.80,
    status: "Processing"
  },
  {
    id: 4,
    date: "2023-05-28",
    magazineTitle: "Home Design Quarterly",
    retailerId: 101,
    retailerName: "City Books",
    quantity: 10,
    amount: 99.90,
    status: "Completed"
  }
];

// Retailer's orders
export const retailerOrders = [
  {
    id: 1,
    date: "2023-06-15",
    magazineTitle: "Modern Living",
    publisherName: "Home & Style Publications",
    quantity: 25,
    amount: 224.75,
    status: "Delivered"
  },
  {
    id: 2,
    date: "2023-06-10",
    magazineTitle: "Tech Today",
    publisherName: "Digital Media Group",
    quantity: 15,
    amount: 112.50,
    status: "Shipped"
  },
  {
    id: 3,
    date: "2023-06-05",
    magazineTitle: "Fashion Forward",
    publisherName: "Style House",
    quantity: 20,
    amount: 259.80,
    status: "Processing"
  }
];

// Retailer's inventory
export const retailerInventory = [
  {
    id: 1,
    title: "Modern Living",
    publisher: "Home & Style Publications",
    inStock: 18,
    sold: 7,
    price: 8.99,
    coverImage: "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 2,
    title: "Tech Today",
    publisher: "Digital Media Group",
    inStock: 12,
    sold: 3,
    price: 7.50,
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: 4,
    title: "Fashion Forward",
    publisher: "Style House",
    inStock: 20,
    sold: 0,
    price: 12.99,
    coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
  }
];