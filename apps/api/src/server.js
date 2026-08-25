require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const seedInitialData = require("./config/seed");

// Connect to MongoDB and seed initial data if empty
connectDB().then(() => {
  seedInitialData();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
