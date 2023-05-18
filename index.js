const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3010;
const cors = require("cors");

app.use(
    cors({
      origin: "http://localhost:3000",  
    })
  );

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Define the item schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
});

const Item = mongoose.model('Item', itemSchema);

// Middleware to parse JSON
app.use(express.json());

// GET - Get all items
app.get('/items', (req, res) => {
  Item.find()
    .then((items) => {
      res.json(items);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// POST - Add a new item
app.post('/items', (req, res) => {
  const { name, email, mobile } = req.body;

  // Validation checks
  if (!name || !email || !mobile) {
    return res.status(400).json({ error: 'Please provide name, email, and mobile' });
  }

  const newItem = new Item({ name, email, mobile });

  newItem.save()
    .then((item) => {
      res.status(201).json(item);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// PUT - Edit an item
app.put('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const { name, email, mobile } = req.body;

  // Validation checks
  if (!name || !email || !mobile) {
    return res.status(400).json({ error: 'Please provide name, email, and mobile' });
  }

  Item.findByIdAndUpdate(itemId, { name, email, mobile }, { new: true })
    .then((item) => {
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(item);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// DELETE - Delete an item
app.delete('/items/:id', (req, res) => {
  const itemId = req.params.id;

  Item.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json({ message: 'Item deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
