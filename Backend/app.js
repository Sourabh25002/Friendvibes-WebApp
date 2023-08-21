import express from 'express';
import mongoose from 'mongoose';
import { mongoUrl } from './keys.js'; // Importing the MongoDB URL from keys.js
import cors from 'cors';
import './models/model.js'; // Importing the user model
import './models/post.js'; // Importing the post model
import authRoutes from './routes/auth.js'; // Importing authentication routes
import createPostRoutes from './routes/createPost.js'; // Importing create post routes
import userRoutes from './routes/user.js'; // Importing user routes
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT|| 5001;

// Enable CORS to handle cross-origin requests
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Serve static files from the frontend build folder
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Handle other routes and serve the index.html file for client-side routing
app.get('/frontend', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'), (err) => {
    if (err) {
      res.status(404).send('File not found'); // Return a 404 response if index.html is not found
    }
  });
});


// Use the imported routes for authentication, creating posts, and user operations
app.use(authRoutes);
app.use(createPostRoutes);
app.use(userRoutes);

// Connect to the MongoDB database using the provided URL
mongoose.connect(mongoUrl ,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

// Event listeners for MongoDB connection status
mongoose.connection.on('connected', () => {
    console.log('Successfully connected to MongoDB');
});

mongoose.connection.on('error', () => {
    console.log('Not connected to MongoDB');
});




// Start the Express server on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
