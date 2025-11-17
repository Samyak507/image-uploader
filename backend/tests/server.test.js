const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../server');
const imagesStore = require('../imagesStore');


beforeEach(() => imagesStore.clear());


test('upload a small png image', async () => {
    const res = await request(app)
        .post('/upload')
        .attach('image', Buffer.from([0x89, 0x50, 0x4e, 0x47]), 'small.png'); // minimal PNG header
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
});


test('reject unsupported type', async () => {
    const res = await request(app)
        .post('/upload')
        .attach('image', Buffer.from('hello'), 'file.txt');
    expect(res.statusCode).toBe(400);
});


test('delete image', async () => {
    const up = await request(app)
        .post('/upload')
        .attach('image', Buffer.from([0xFF, 0xD8, 0xFF]), 'a.jpg');
    const id = up.body.id;
    const del = await request(app).delete(`/images/${id}`);
    expect(del.statusCode).toBe(200);
    const get = await request(app).get(`/images/${id}`);
    expect(get.statusCode).toBe(404);
});