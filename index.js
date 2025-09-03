const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Schemas
const MenuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String
});
const Menu = mongoose.model("Menu", MenuSchema);

const OrderSchema = new mongoose.Schema({
  tableNumber: Number,
  items: [{
    menuId: String,
    name: String,
    qty: Number,
    price: Number
  }],
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", OrderSchema);

// Routes
// Menu
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/menus", async (req, res) => {
  const menus = await Menu.find();
  res.json(menus);
});

app.post("/api/menus", async (req, res) => {
  const menu = new Menu(req.body);
  await menu.save();
  res.json(menu);
});

// Orders
app.post("/api/orders", async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json(order);
});

app.get("/api/orders/:tableNumber", async (req, res) => {
  const orders = await Order.find({ tableNumber: req.params.tableNumber });
  res.json(orders);
});

app.put("/api/orders/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(order);
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
