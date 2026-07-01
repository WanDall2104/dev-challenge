import express from 'express';
import cors from 'cors';
import searchRoutes from './routes/searchRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MultiSearch API',
    timestamp: new Date().toISOString(),
  });
});

// Search routes
app.use('/api', searchRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`\n🔍 MultiSearch API running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Search: http://localhost:${PORT}/api/search?q=mesa\n`);
});
