require("dotenv").config();


const express = require("express");
const cors = require("cors");
const vendorRoutes = require("./routes/vendors.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/vendors", vendorRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Mock server running at http://localhost:${PORT}`);
});
