import { describe, it, expect } from 'vitest';
const request = require('supertest');
const app = require('./app');

describe('App Setup', () => {
	it('Should disable x-powered-by header', async () => {
		app.get('/test_x-powered-by', (req, res) => {
			res.send('');
		});
		const res = await request(app).get('/test_x-powered-by');
		expect(res.headers['x-powered-by']).toBeUndefined();
	});
});
