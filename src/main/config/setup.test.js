import { describe, it, expect } from 'vitest';
const request = require('supertest')
const app = require('./app')

describe('App Setup', () => {
  it('Shoul disable x-powered-by header', async () => {
    app.get('/test', (req, res) => {
      res.send('')
    })
    const res = await request(app).get('/test')
    expect(res.headers['x-powered-by']).toBeUndefined()
  });
});
