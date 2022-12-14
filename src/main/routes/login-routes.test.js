import { describe, it, beforeAll, beforeEach, afterAll } from 'vitest';
const request = require('supertest');

const app = require('../config/app');

const mongoHelper = require('../../infra/helpers/mongo-helper');
const bcrypt = require('bcrypt');
let userModel;

describe('Login Routes', () => {
	beforeAll(async () => {
		await mongoHelper.create();
		await mongoHelper.connect();
		userModel = await mongoHelper.getCollection('users');
	});
	beforeEach(async () => {
		await userModel.deleteMany();
	});

	afterAll(async () => {});

	it('Should return 200 when valid credentials are provided', async () => {
		await userModel.insertOne({
			email: 'valid_email@email.com',
			password: bcrypt.hashSync('hashed_password', 10),
		});

		await request(app)
			.post('/api/login')
			.send({ email: 'valid_email@email.com', password: 'hashed_password' })
			.expect(200);
	});

	it('Should return 401 when invalid credentials are provided', async () => {
		await request(app)
			.post('/api/login')
			.send({ email: 'valid_email@email.com', password: 'hashed_password' })
			.expect(401);
	});
});
