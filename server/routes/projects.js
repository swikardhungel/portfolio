const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'projects.json');

// Helper — read current projects list from disk
function readProjects() {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
}

// Helper — persist projects list to disk
function writeProjects(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/* GET /api/projects — return every project */
router.get('/', (_req, res) => {
    try {
        const projects = readProjects();
        res.json(projects);
    } catch (err) {
        console.error('Failed to read projects:', err.message);
        res.status(500).json({ error: 'Could not load projects' });
    }
});

/* POST /api/projects — add a new project */
router.post('/', (req, res) => {
    const { title, description, technologies, image, github } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
        const projects = readProjects();
        const newProject = {
            id: projects.length ? projects[projects.length - 1].id + 1 : 1,
            title,
            description,
            technologies: technologies || [],
            image: image || '',
            github: github || ''
        };
        projects.push(newProject);
        writeProjects(projects);
        res.status(201).json(newProject);
    } catch (err) {
        console.error('Failed to save project:', err.message);
        res.status(500).json({ error: 'Could not save project' });
    }
});

module.exports = router;
