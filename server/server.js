const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const imageRoutes = require('./routes/imageRoutes');

dotenv.config();

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

app.use('/api', imageRoutes);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
