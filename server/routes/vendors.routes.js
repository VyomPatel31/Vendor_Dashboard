const fs = require("fs");
const path = require("path");



const express = require("express");
const router = express.Router();
const delay = require("../utils/delay");
const data = require("../data/mockData.json");

const filePath = path.join(__dirname, "../data/mockData.json");



router.get("/", async (req, res) => {
  await delay();


  if (Math.random() < 0.1) {
    return res.status(500).json({ message: "Failed to fetch vendors" });
  }

  res.json({ vendor: data.vendors });
});


// BULK UPDATE STATUS - Must come before /:id routes
router.patch("/bulk/status", async (req, res) => {
  await delay(1000);

  const { ids, status } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Invalid ids array" });
  }

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  // Update vendors with matching ids
  const updatedVendors = [];
  ids.forEach(id => {
    const vendor = data.vendors.find(v => v.id === id);
    if (vendor) {
      vendor.status = status;
      updatedVendors.push(vendor);
    }
  });

  // ✅ SAVE BACK TO FILE
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2)
  );

  res.json({ vendors: updatedVendors });
});

// BULK DELETE - Must come before parameterized routes
router.delete("/bulk", async (req, res) => {
  await delay(1000);

  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Invalid ids array" });
  }

  // Filter out vendors with matching ids
  data.vendors = data.vendors.filter(v => !ids.includes(v.id));

  // ✅ SAVE BACK TO FILE
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2)
  );

  res.json({ success: true });
});

router.get("/:id", async (req, res) => {
  await delay();

  const vendor = data.vendors.find(v => v.id === req.params.id);

  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }

  res.json({ vendor });
});

router.patch("/:id/status", async (req, res) => {
  await delay(800);

  const { status } = req.body;

  const vendor = data.vendors.find(v => v.id === req.params.id);

  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }

  // update value
  vendor.status = status;

  // ✅ SAVE BACK TO FILE
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2)
  );

  res.json({ vendor });
});

module.exports = router;
