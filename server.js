// Simple Express server to verify port binding for Render
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files
app.use(express.static('build'));

// API endpoint to verify the server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', port: PORT, env: process.env.NODE_ENV });
});

// For all other requests, serve the index.html file
app.get('*', (req, res) => {
  const indexPath = path.resolve('build', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Application is running but index.html not found');
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
