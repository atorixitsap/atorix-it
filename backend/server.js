const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();

// --- Environment Variable Checks (Good Practice) ---
if (!process.env.SENDGRID_API_KEY) {
  console.warn("WARNING: SENDGRID_API_KEY environment variable not set. Email notifications will fail.");
}
if (!process.env.MONGODB_URI) {
  console.error("ERROR: MONGODB_URI environment variable not set. Cannot connect to database.");
  process.exit(1); // Exit if DB connection string is missing
}

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- CORS Configuration ---
const allowedOrigins = [
    'https://atorixit.in', // Main domain
    'https://www.atorixit.in', // Optional www subdomain
    'https://atorix-testing.vercel.app', // Testing domain
    'http://localhost:3000', // For local development
    'http://localhost:5000', // For local development alternative port
    'http://localhost:5001' // For local development alternative port
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// --- Middleware ---
app.use(bodyParser.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("FATAL: Error connecting to MongoDB:", err);
  process.exit(1);
});

// --- Mongoose Schema and Model ---
const userSchema = new mongoose.Schema({
  // Basic info (required)
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
  phone: { type: String, required: [true, 'Phone number is required'], trim: true },

  // Company info
  company: { type: String, trim: true },

  // Demo form specific fields
  role: { type: String, trim: true },
  interestedIn: { type: [String], default: [] },

  // Common fields
  message: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// --- API Routes ---

// === Form Submission Route ===
app.post("/api/submit", async (req, res) => {

  // Destructure inputs
  const {
    name: nameInput,
    email: emailInput,
    phone: phoneInput,
    company: companyInput,
    role: roleInput,
    interestedIn: interestedInInput,
    message: messageInput
  } = req.body;

  // Trim values or use default if null/undefined
  const name = nameInput?.trim();
  const email = emailInput?.trim().toLowerCase();
  const phone = phoneInput?.trim();
  const company = companyInput?.trim() || '';
  const role = roleInput?.trim() || '';
  // interestedIn should be an array of strings; ensure it is
  let interestedIn = [];
  if (Array.isArray(interestedInInput)) {
    interestedIn = interestedInInput.map(item => item.trim()).filter(item => item.length > 0);
  } else if (typeof interestedInInput === 'string' && interestedInInput.trim().length > 0) {
    // If a single string is sent, convert to array
    interestedIn = [interestedInInput.trim()];
  }
  const message = messageInput?.trim() || '';


  // --- Backend Validation ---
  if (!name || !email || !phone) {

    return res.status(400).json({ message: "Please fill in Name, Email, and Phone Number." });
  }

  try {
    // --- Check for existing user by email OR phone number ---
    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { phone: phone }
      ]
    }).lean();

    if (existingUser) {
      let conflictMessage = "This record cannot be added because of a duplicate entry.";
      if (existingUser.email === email) {
        conflictMessage = "This email address is already registered. Please use a different email.";
      } else if (existingUser.phone === phone) {
        conflictMessage = "This phone number is already registered. Please use a different number.";
      }
      return res.status(400).json({ message: conflictMessage });
    }



    const newUser = new User({
        name,
        email,
        phone,
        company,
        role,
        interestedIn,
        message
    });

    const savedUser = await newUser.save();

    // --- Send Email Notification (Best effort) ---
    if (process.env.SENDGRID_API_KEY && process.env.NOTIFICATION_EMAIL && process.env.SENDER_EMAIL) {
        try {
            // Compose interestedIn as comma separated string for email
            const interestedInStr = interestedIn.length > 0 ? interestedIn.join(', ') : 'N/A';

            const msg = {
                to: process.env.NOTIFICATION_EMAIL,
                from: {
                    email: process.env.SENDER_EMAIL,
                    name: 'Connecting Dots ERP Notifications'
                },
                replyTo: email,
                subject: `New Lead: ${name} (${role || 'No Role Specified'})`,
                text: `New lead details:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company || 'N/A'}\nRole: ${role || 'N/A'}\nInterested In: ${interestedInStr}\nMessage: ${message || 'N/A'}\nSubmitted: ${new Date().toLocaleString()}`,
                html: `<h3>New Lead Registered</h3>
                       <p><strong>Name:</strong> ${name}</p>
                       <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                       <p><strong>Phone:</strong> ${phone}</p>
                       <p><strong>Company:</strong> ${company || 'N/A'}</p>
                       <p><strong>Role:</strong> ${role || 'N/A'}</p>
                       <p><strong>Interested In:</strong> ${interestedInStr}</p>
                       <p><strong>Message:</strong> ${message || 'N/A'}</p>
                       <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>`
            };
            await sgMail.send(msg);
        } catch (emailError) {
            console.error("Error sending email notification:", emailError.response ? JSON.stringify(emailError.response.body) : emailError.message);
        }
    } else {
        console.warn("Email notification skipped due to missing SendGrid/Email configuration in .env");
    }

    // --- Success Response to Frontend ---
    return res.status(201).json({ message: "Registration successful! We will contact you soon." });

  } catch (dbError) {
    // Catch errors from findOne or save operations
    console.error("!!! Error during database operation in /api/submit:", dbError);
    // If it's a validation error from Mongoose (e.g., required field missing despite frontend check failing)
    if (dbError.name === 'ValidationError') {
        return res.status(400).json({ message: dbError.message });
    }
    // Otherwise, assume internal server error
    return res.status(500).json({ message: "An internal server error occurred. Please try again later.", error: dbError.message });
  }
});

// === Fetch Leads Route ===
app.get("/api/leads", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Failed to fetch leads.", error: error.message });
  }
});

// === Delete Lead Route ===
app.delete("/api/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid lead ID format." });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Lead not found." });
    }
    res.status(200).json({ message: "Lead deleted successfully." });
  } catch (error) {
    console.error(`Error deleting lead with ID (${req.params.id}):`, error);
    res.status(500).json({ message: "Internal Server Error occurred while deleting.", error: error.message });
  }
});

// --- Basic Root Route ---
app.get("/", (req, res) => {
  res.status(200).send("Atorix Backend is running.");
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
     console.error(`CORS Error caught by global handler: ${err.message} from origin ${req.header('Origin')}`);
     return res.status(403).json({ message: 'Access denied by CORS policy.' });
  }
  console.error("!!! Unhandled Error Caught by Global Handler:", err.stack || err);
  res.status(500).json({ message: 'An unexpected internal server error occurred.' });
});

// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening intently on port ${PORT}`);
});
