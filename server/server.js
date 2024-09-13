const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const imageRoutes = require('./routes/imageRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
const port = 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use(cors());
app.use(express.json({ limit: '16mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', imageRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});