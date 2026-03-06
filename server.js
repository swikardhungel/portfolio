const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ─────────────────────────────────────── */
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── API Routes ────────────────────────────────────── */
const projectRoutes = require('./server/routes/projects');
const contactRoutes = require('./server/routes/contact');
const collabRoutes = require('./server/routes/collaboration');

app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/collaboration', collabRoutes);

/* ── Start Server ──────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`Backend API running → http://localhost:${PORT}`);
});
