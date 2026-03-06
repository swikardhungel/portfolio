const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'collaborations.json');

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

function readCollaborations() {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
}

function writeCollaborations(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/* POST /api/collaboration — submit a questionnaire */
router.post('/', (req, res) => {
    const { name, email, expertise, technologies, contribution, suggestions, projectTitle } = req.body;

    if (!name || !email || !expertise) {
        return res.status(400).json({ error: 'Name, Email, and Expertise are required' });
    }

    try {
        const collaborations = readCollaborations();
        const newSubmission = {
            id: collaborations.length ? collaborations[collaborations.length - 1].id + 1 : 1,
            projectTitle: projectTitle || 'General',
            name,
            email,
            expertise,
            technologies,
            contribution,
            suggestions,
            timestamp: new Date().toISOString()
        };
        collaborations.push(newSubmission);
        writeCollaborations(collaborations);
        res.status(201).json({ success: true, message: 'Thank you for your interest! We will be in touch.' });
    } catch (err) {
        console.error('Failed to save collaboration:', err.message);
        res.status(500).json({ error: 'Could not process submission' });
    }
});

module.exports = router;
