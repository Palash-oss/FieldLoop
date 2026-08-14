require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
