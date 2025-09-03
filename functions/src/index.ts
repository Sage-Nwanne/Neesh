import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import express, {Request, Response, NextFunction} from "express";
import cors from "cors";
import helmet from "helmet";
import {createClient} from "@supabase/supabase-js";

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: any;
}

// Set global options for cost control
setGlobalOptions({maxInstances: 10});

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: true, // Allow all origins for Firebase Functions
  credentials: true,
}));
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true}));

// Initialize Supabase
// For now, we'll use placeholder values that will be set during deployment
const supabaseUrl = process.env.SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder_key";

if (supabaseUrl === "https://placeholder.supabase.co" ||
    supabaseServiceKey === "placeholder_key") {
  logger.warn("Using placeholder Supabase credentials - update these for production");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Simple admin authentication middleware
const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({message: "No token provided"});
      return;
    }

    const token = authHeader.substring(7);

    try {
      // Decode the simple token (base64 encoded JSON)
      const decoded = JSON.parse(Buffer.from(token, "base64").toString());

      if (decoded.role === "admin" || decoded.role === "owner") {
        req.user = decoded;
        next();
      } else {
        res.status(403).json({message: "Admin access required"});
      }
    } catch (decodeError) {
      res.status(401).json({message: "Invalid token"});
    }
  } catch (error) {
    logger.error("Auth middleware error:", error);
    res.status(500).json({message: "Authentication error"});
  }
};

// Health check endpoint
app.get("/health", (req: Request, res: Response): void => {
  res.json({
    status: "OK",
    message: "NEESH API is running on Firebase Functions",
    timestamp: new Date().toISOString(),
    environment: "production",
    version: "1.0.0",
  });
});

// Publisher application submission endpoint
app.post("/publisher/application", async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationData = req.body;

    // Insert application into Supabase (matching existing table structure)
    const insertData: any = {
      email: applicationData.email,
      first_name: applicationData.first_name,
      last_name: applicationData.last_name,
      business_name: applicationData.business_name,
      magazine_title: applicationData.magazine_title,
      description: applicationData.description,
      status: "pending",
    };

    // Add optional fields only if they exist in the form data
    if (applicationData.publication_type) {
      insertData.publication_type = applicationData.publication_type;
    }
    if (applicationData.issue_number) {
      insertData.issue_number = applicationData.issue_number;
    }
    if (applicationData.issue_frequency) {
      insertData.issue_frequency = applicationData.issue_frequency;
    }
    if (applicationData.social_website_link) {
      insertData.social_website_link = applicationData.social_website_link;
    }
    if (applicationData.print_run) {
      insertData.print_run = parseInt(applicationData.print_run);
    }
    if (applicationData.available_quantity) {
      insertData.available_quantity = parseInt(applicationData.available_quantity);
    }
    if (applicationData.wholesale_price) {
      insertData.wholesale_price = parseFloat(applicationData.wholesale_price);
    }
    if (applicationData.suggested_retail_price) {
      insertData.suggested_retail_price =
        parseFloat(applicationData.suggested_retail_price);
    }
    if (applicationData.specs) insertData.specs = applicationData.specs;
    if (applicationData.volume_pricing) {
      insertData.volume_pricing_tiers = applicationData.volume_pricing;
    }
    if (applicationData.cover_image_url) {
      insertData.cover_image_url = applicationData.cover_image_url;
    }
    if (applicationData.has_sold_before) {
      insertData.has_sold_before = applicationData.has_sold_before === "yes";
    }
    if (applicationData.distribution_channels) {
      insertData.distribution_channels = applicationData.distribution_channels;
    }
    if (applicationData.estimated_copies_sold) {
      insertData.copies_sold_estimate =
        parseInt(applicationData.estimated_copies_sold);
    }
    if (applicationData.sales_feedback) {
      insertData.quotes_feedback = applicationData.sales_feedback;
    }
    if (applicationData.fulfillment_method) {
      insertData.fulfillment_method = applicationData.fulfillment_method;
    }
    if (applicationData.shipping_city) {
      insertData.shipping_city = applicationData.shipping_city;
    }
    if (applicationData.shipping_state) {
      insertData.shipping_state = applicationData.shipping_state;
    }
    if (applicationData.shipping_country) {
      insertData.shipping_country = applicationData.shipping_country;
    }
    if (applicationData.return_policy) {
      insertData.accepts_returns = applicationData.return_policy;
    }

    const {data: application, error} = await supabase
      .from("publisher_applications")
      .insert([insertData])
      .select()
      .single();

    if (error) {
      logger.error("Error submitting application:", error);
      res.status(500).json({message: "Failed to submit application"});
      return;
    }

    res.status(201).json({
      applicationId: application.id,
      message: "Application submitted successfully",
    });
  } catch (error) {
    logger.error("Submit application error:", error);
    res.status(500).json({message: "Internal server error"});
  }
});

// Admin endpoints
// GET /admin/applications - Get all publisher applications
app.get("/admin/applications", requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {data: applications, error} = await supabase
      .from("publisher_applications")
      .select("*")
      .order("created_at", {ascending: false});

    if (error) {
      logger.error("Error fetching applications:", error);
      res.status(500).json({message: "Failed to fetch applications"});
      return;
    }

    // Transform data to match admin panel interface
    const transformedApplications = applications.map((app: any) => ({
      id: app.id,
      type: "publisher",
      applicantName:
        `${app.first_name || "Unknown"} ${app.last_name || "User"}`,
      businessName: app.business_name || "Unknown Business",
      email: app.email || "No email",
      status: app.status,
      submittedAt: app.created_at, // Use created_at instead of submitted_at
      magazineTitle: app.magazine_title,
      applicationData: app,
    }));

    res.json(transformedApplications);
  } catch (error) {
    logger.error("Admin applications error:", error);
    res.status(500).json({message: "Internal server error"});
  }
});

// PUT /admin/applications/:id/approve - Approve application
app.put("/admin/applications/:id/approve", requireAdmin,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const {id} = req.params;

      const {data: application, error} = await supabase
        .from("publisher_applications")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
        // Skip reviewed_by for now since it expects UUID
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        logger.error("Error approving application:", error);
        res.status(500).json({message: "Failed to approve application"});
        return;
      }

      res.json({
        message: "Application approved successfully",
        application,
      });
    } catch (error) {
      logger.error("Approve application error:", error);
      res.status(500).json({message: "Internal server error"});
    }
  });

// PUT /admin/applications/:id/deny - Deny application
app.put("/admin/applications/:id/deny", requireAdmin,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const {id} = req.params;
      const {reason} = req.body;

      const {data: application, error} = await supabase
        .from("publisher_applications")
        .update({
          status: "denied",
          reviewer_notes: reason,
          reviewed_at: new Date().toISOString(),
        // Skip reviewed_by for now since it expects UUID
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        logger.error("Error denying application:", error);
        res.status(500).json({message: "Failed to deny application"});
        return;
      }

      res.json({
        message: "Application denied successfully",
        application,
      });
    } catch (error) {
      logger.error("Deny application error:", error);
      res.status(500).json({message: "Internal server error"});
    }
  });

// GET /admin/reports - Get reported publishers (mock for now)
app.get("/admin/reports", requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Mock data for now - you can implement actual reports table later
    const mockReports = [
      {
        id: "1",
        publisherName: "Alex Thompson",
        businessName: "Fake Magazine Co",
        reportReason: "Fraudulent business practices",
        reportedAt: "2024-01-12T16:45:00Z",
        reportedBy: "retailer@example.com",
        status: "under_review",
      },
      {
        id: "2",
        publisherName: "Lisa Brown",
        businessName: "Scam Publications",
        reportReason: "Inappropriate messaging to retailers",
        reportedAt: "2024-01-11T11:30:00Z",
        reportedBy: "store@example.com",
        status: "under_review",
      },
    ];

    res.json(mockReports);
  } catch (error) {
    logger.error("Admin reports error:", error);
    res.status(500).json({message: "Internal server error"});
  }
});

// GET /admin/messages - Get messages from hi@neesh.art (mock for now)
app.get("/admin/messages", requireAdmin, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Mock data for now - you can implement actual email integration later
    const mockMessages = [
      {
        id: "1",
        from: "publisher@example.com",
        subject: "Question about application process",
        body: "Hi, I submitted my application last week and wanted to check " +
              "on the status. Could you please provide an update?",
        receivedAt: "2024-01-15T08:30:00Z",
        isRead: false,
        isReplied: false,
      },
      {
        id: "2",
        from: "retailer@bookstore.com",
        subject: "Partnership inquiry",
        body: "We are interested in becoming a retail partner and would " +
              "like to know more about the process.",
        receivedAt: "2024-01-14T15:20:00Z",
        isRead: true,
        isReplied: false,
      },
    ];

    res.json(mockMessages);
  } catch (error) {
    logger.error("Admin messages error:", error);
    res.status(500).json({message: "Internal server error"});
  }
});

// Export the Express app as a Firebase Function
export const api = onRequest(app);
