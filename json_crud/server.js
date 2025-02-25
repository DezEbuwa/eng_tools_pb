const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'deployments.json');

app.use(bodyParser.json());

// Read data from JSON file
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
};

// Write data to JSON file
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// CRUD Endpoints
app.get('/deployments', (req, res) => {
  res.json(readData());
});

app.post('/deployments', (req, res) => {
  const deployments = readData();
  const newDeployment = { id: Date.now(), ...req.body };
  deployments.push(newDeployment);
  writeData(deployments);
  res.json(newDeployment);
});

app.get('/deployments/:id', (req, res) => {
  const deployments = readData();
  const deployment = deployments.find(d => d.id == req.params.id);
  res.json(deployment || { error: 'Not found' });
});

app.put('/deployments/:id', (req, res) => {
  let deployments = readData();
  deployments = deployments.map(d => d.id == req.params.id ? { ...d, ...req.body } : d);
  writeData(deployments);
  res.json({ message: 'Updated' });
});

app.delete('/deployments/:id', (req, res) => {
  let deployments = readData();
  deployments = deployments.filter(d => d.id != req.params.id);
  writeData(deployments);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
