import { describe, it, expect } from 'vitest';
const request = require('supertest');
const app = require('../config/app');

describe('Content-Type Middleware', () => {
	it('Should return JSON content type as default', async () => {
		app.get('/test_content_type', (req, res) => {
			res.send('');
		});
		await request(app).get('/test_content_type').expect('Content-Type', /json/);
	});
});
