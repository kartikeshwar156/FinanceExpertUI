import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Log startup information
console.log('🚀 Starting FinanceExpertUI server...');
console.log(`📊 Port: ${port}`);
console.log(`📁 Directory: ${__dirname}`);
console.log(`📦 Node version: ${process.version}`);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files from dist directory
const distPath = join(__dirname, 'dist');
console.log(`📂 Serving static files from: ${distPath}`);
app.use(express.static(distPath));

// Handle all other routes by serving index.html (for React Router)
app.get('*', (req, res) => {
  const indexPath = join(distPath, 'index.html');
  console.log(`🔄 Serving index.html for route: ${req.path}`);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ Error serving index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server successfully started on port ${port}`);
  console.log(`🌐 Application available at: http://localhost:${port}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
}); 