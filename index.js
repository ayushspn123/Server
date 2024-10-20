const express = require('express');
const mongoose = require('mongoose');
const ruleRoutes = require('./routes'); // Adjust the path as necessary
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://ayushvermaspn:eq41da4EIkehT76f@cluster0.8vjdo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/RuleEngine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));

// Define your routes
app.use('/api/rules', ruleRoutes);

// Export the app for testing
module.exports = app;

// Start the server only if not in test environment
if (require.main === module) {
  const PORT = process.env.PORT || 9000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
