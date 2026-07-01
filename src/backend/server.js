import express from 'express';
import cors from 'cors';

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

// TODO: Search routes will be added in Commit 2
app.get('/api/search', (req, res) => {
  res.json({
    message: 'Search API endpoint - coming in next commit',
    query: req.query.q || '',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🔍 MultiSearch API running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Search: http://localhost:${PORT}/api/search?q=mesa\n`);
});
