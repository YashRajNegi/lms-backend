const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit if database connection fails
    });

// Import Routers
const courseRoutes = require('./routes/courses');
const discussionRoutes = require('./routes/discussions');
const assignmentRoutes = require('./routes/assignments');
const notificationRoutes = require('./routes/notifications');
const userRoutes = require('./routes/users');
const webhookRoutes = require('./routes/webhook');
const contactRoutes = require('./routes/contact');

// Mount Routers
app.use('/api/courses', courseRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/contact', contactRoutes);

// Health Check Route
app.get("/", (req, res) => {
    res.send("API is running.");
});

// 404 Route Handler
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Central Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Error Handler:", err.stack);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});
