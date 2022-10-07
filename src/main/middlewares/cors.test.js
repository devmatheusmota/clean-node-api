import { describe, it, expect } from 'vitest';
const request = require('supertest')
const app = require('../config/app')

describe('CORS Middleware', () => {

  it('Shoul enable CORS', async () => {
    app.get('/test_cors', (req, res) => {
      res.send('')
    })
    const res = await request(app).get('/test')
    expect(res.headers['access-control-allow-origin']).toBe('*')
    expect(res.headers['access-control-allow-methods']).toBe('*')
    expect(res.headers['access-control-allow-headers']).toBe('*')
  });
});
