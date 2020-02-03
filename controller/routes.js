const express = require("express");
const router = express.Router();
const earthquakeData = require('../data-sets/earthquakes.json');
const faultLineData = require('../data-sets/faults.json');

router.get('/api/google', function(req, res) {
    res.json({ googleMapsApiKey: 'AIzaSyDomeXKvy8n2GG1lCgJ7KZLenY7atqHdNU' })
})

router.get('/data/earthquake', function(req, res) {
    res.json({ earthquakeData: earthquakeData, faultLineData: faultLineData });
});

module.exports = router;