
const express = require('express');
const connectDB = require('./config/db.js');
const indexRoutes = require('./routes/index.routes.js');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api', indexRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
