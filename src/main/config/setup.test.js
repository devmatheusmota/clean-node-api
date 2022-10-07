import { describe, it, expect } from 'vitest';
const request = require('supertest')
const app = require('./app')

describe('App Setup', () => {
  it('Shoul disable x-powered-by header', async () => {
    app.get('/test_x-powered-by', (req, res) => {
      res.send('')
    })
    const res = await request(app).get('/test_x-powered-by')
    expect(res.headers['x-powered-by']).toBeUndefined()
  });

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
