const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support large graph data payloads

// In-memory data store for trajectories
let trajectories = [];

// --- API Endpoints ---

// GET all trajectories (summary: id and subjectName)
app.get('/api/trajectories', (req, res) => {
  res.json(trajectories.map(({ id, subjectName }) => ({ id, subjectName })));
});

// POST a new trajectory
app.post('/api/trajectories', (req, res) => {
  const { subjectName, nodes, edges, id: providedId } = req.body; // 'id' can be provided for special cases (e.g. predefined)
  
  if (!subjectName) {
    return res.status(400).json({ message: 'Subject name is required' });
  }

  // Prevent duplicate ID creation if one is provided and already exists
  if (providedId && trajectories.some(t => t.id === providedId)) {
    return res.status(409).json({ message: `Trajectory with ID ${providedId} already exists.`});
  }

  const newTrajectory = {
    id: providedId || uuidv4(), // Use provided ID or generate a new one
    subjectName,
    description: req.body.description || "", // Optional description
    nodes: nodes || [], // Initialize with provided nodes or empty array
    edges: edges || [], // Initialize with provided edges or empty array
  };
  
  trajectories.push(newTrajectory);
  console.log(`Created trajectory: ${newTrajectory.id} - ${newTrajectory.subjectName}`);
  res.status(201).json(newTrajectory); // Respond with the full new trajectory object
});

// GET a specific trajectory by ID
app.get('/api/trajectories/:id', (req, res) => {
  const trajectory = trajectories.find(t => t.id === req.params.id);
  if (trajectory) {
    res.json(trajectory);
  } else {
    res.status(404).json({ message: 'Trajectory not found' });
  }
});

// PUT (update) a specific trajectory by ID
app.put('/api/trajectories/:id', (req, res) => {
  const trajectoryIndex = trajectories.findIndex(t => t.id === req.params.id);
  if (trajectoryIndex !== -1) {
    const currentTrajectory = trajectories[trajectoryIndex];
    // Update fields: use new value if provided, otherwise keep current.
    // For nodes and edges, replace completely as per frontend behavior.
    trajectories[trajectoryIndex] = {
      ...currentTrajectory,
      subjectName: req.body.subjectName || currentTrajectory.subjectName,
      description: req.body.description !== undefined ? req.body.description : currentTrajectory.description,
      nodes: req.body.nodes !== undefined ? req.body.nodes : currentTrajectory.nodes, // Allow sending empty array to clear
      edges: req.body.edges !== undefined ? req.body.edges : currentTrajectory.edges,
    };
    console.log(`Updated trajectory: ${trajectories[trajectoryIndex].id}`);
    res.json(trajectories[trajectoryIndex]);
  } else {
    res.status(404).json({ message: 'Trajectory not found' });
  }
});

// DELETE a trajectory by ID
app.delete('/api/trajectories/:id', (req, res) => {
  const initialLength = trajectories.length;
  trajectories = trajectories.filter(t => t.id !== req.params.id);
  
  if (trajectories.length < initialLength) {
    console.log(`Deleted trajectory: ${req.params.id}`);
    res.status(200).json({ message: 'Trajectory deleted successfully' });
  } else {
    res.status(404).json({ message: 'Trajectory not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});