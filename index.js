const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Define the bfs tree node model using Mongoose
const nodeSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  left: { type: mongoose.Schema.Types.ObjectId, ref: 'Node' },
  right: { type: mongoose.Schema.Types.ObjectId, ref: 'Node' }
});

const Node = mongoose.model('Node', nodeSchema);

app.get('/bfs/:startValue', async (req, res) => {
  const startValue = parseInt(req.params.startValue);

  // Connect to MongoDB using Mongoose
  await mongoose.connect("mongodb://localhost/binary-tree-db");

  // Find the starting node
  const startNode = await Node.findOne({ value: startValue });

  if (!startNode) {
    res.status(404).send("Node with value startValue not found");
    return;
  }

  // Perform breadth-first search
  const queue = [startNode];
  const visited = new Set();

  while (queue.length > 0) {
    const currentNode = queue.shift();

    if (currentNode.value === startValue) {
      res.send(currentNode);
      return;
    }

    visited.add(currentNode._id);

    if (currentNode.left && !visited.has(currentNode.left.toString())) {
      const leftNode = await Node.findById(currentNode.left);
      queue.push(leftNode);
    }

    if (currentNode.right && !visited.has(currentNode.right.toString())) {
      const rightNode = await Node.findById(currentNode.right);
      queue.push(rightNode);
    }
  }

  res.status(404).send("Node with value startValue not found in tree");
});

app.listen(3000, () => {
  console.log("app listening at http://localhost:3000");
});