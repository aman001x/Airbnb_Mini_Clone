const express = require('express');
const router = express.Router();

// Mock data for example
const properties = [
    { name: 'Beach House', location: 'California' },
    { name: 'Mountain Cabin', location: 'Colorado' },
    { name: 'City Apartment', location: 'New York' }
];

router.get('/search', (req, res) => {
    const query = req.query.query.toLowerCase();
    const results = properties.filter(property =>
        property.name.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query)
    );
    res.render('index', { results });
});

module.exports = router;