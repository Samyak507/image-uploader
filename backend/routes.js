const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const imagesStore = require('./imagesStore');


const router = express.Router();


// multer memory storage
const upload = multer({ storage: multer.memoryStorage() });


const MAX_BYTES = 3 * 1024 * 1024; // 3 MB


// Upload endpoint - accepts exactly one file in field 'image'
router.post('/upload', upload.single('image'), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });


    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
        return res.status(400).json({ error: 'Only JPEG and PNG are supported' });
    }


    if (file.size > MAX_BYTES) {
        return res.status(400).json({ error: 'File exceeds 3 MB limit' });
    }


    const id = uuidv4();
    const image = { id, filename: file.originalname, mimetype: file.mimetype, buffer: file.buffer };
    imagesStore.add(image);


    res.json({ id, filename: image.filename, mimetype: image.mimetype });
});


// List images metadata
router.get('/images', (req, res) => {
    res.json(imagesStore.list());
});


// Serve image binary
router.get('/images/:id', (req, res) => {
    const image = imagesStore.get(req.params.id);
    if (!image) return res.status(404).json({ error: 'Not found' });
    res.set('Content-Type', image.mimetype);
    res.send(image.buffer);
});


// Delete image
router.delete('/images/:id', (req, res) => {
    const deleted = imagesStore.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
});


module.exports = router;