const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for potentially large graph data

// In-memory data store
let trajectories = [];

// --- Helper to find nested elements ---
function findElement(trajectory, periodId, eventId, elementId) {
    const period = trajectory.periods.find(p => p.id === periodId);
    if (!period) return null;
    const event = period.events.find(e => e.id === eventId);
    if (!event) return null;
    return event.elements.find(el => el.id === elementId) || null;
}


// --- API Endpoints ---

// GET all trajectories (summary)
app.get('/api/trajectories', (req, res) => {
    res.json(trajectories.map(t => ({ id: t.id, subjectName: t.subjectName })));
});

// POST a new trajectory
app.post('/api/trajectories', (req, res) => {
    const { subjectName } = req.body;
    if (!subjectName) {
        return res.status(400).json({ message: 'Subject name is required' });
    }
    const newTrajectory = {
        id: uuidv4(),
        subjectName,
        description: req.body.description || "",
        periods: [], // Initialize with empty periods
        // We will store reactflow nodes and edges directly for simplicity in this in-memory version
        nodes: req.body.nodes || [],
        edges: req.body.edges || [],
    };
    trajectories.push(newTrajectory);
    console.log(`Created trajectory: ${newTrajectory.id} - ${newTrajectory.subjectName}`);
    res.status(201).json(newTrajectory);
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
        // Directly replace with new nodes and edges from React Flow
        trajectories[trajectoryIndex] = {
            ...trajectories[trajectoryIndex], // Keep existing ID, subjectName
            subjectName: req.body.subjectName || trajectories[trajectoryIndex].subjectName,
            description: req.body.description || trajectories[trajectoryIndex].description,
            nodes: req.body.nodes || [],
            edges: req.body.edges || [],
        };
        console.log(`Updated trajectory: ${trajectories[trajectoryIndex].id}`);
        res.json(trajectories[trajectoryIndex]);
    } else {
        res.status(404).json({ message: 'Trajectory not found' });
    }
});

// DELETE a trajectory
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