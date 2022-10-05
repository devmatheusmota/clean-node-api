import { expect, describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
const { MongoClient } = require('mongodb');

let client, db, mongod, uri;
class LoadUserByEmailRepository {
	constructor(userModel) {
		this.userModel = userModel;
	}
	async load(email) {
		this.email = email;
		const user = await this.userModel.findOne({ email });
		return user;
	}
}

const makeSut = () => {
	const userModel = db.collection('users');
	const sut = new LoadUserByEmailRepository(userModel);

	return { userModel, sut };
};

describe('LoadUserByEmail Repository', async () => {
	mongod = await MongoMemoryServer.create();
	uri = mongod.getUri();

	beforeAll(async () => {
		client = await MongoClient.connect(uri);
		db = client.db();
	});

	beforeEach(async () => {
		await db.collection('users').deleteMany();
	});

	afterAll(async () => {
		await client.close();
		await mongod.stop();
	});

	it('Should return null if no user is found', async () => {
		const { sut } = makeSut();
		const user = await sut.load('invalid_email@email.com');
		expect(user).toBeNull();
	});

	it('Should return an user if user is found', async () => {
		const { sut, userModel } = makeSut();
		await userModel.insertOne({
			email: 'valid_email@email.com',
		});
		const user = await sut.load('valid_email@email.com');
		expect(user.email).toBe('valid_email@email.com');
	});
});
