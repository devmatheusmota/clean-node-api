import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';

const MongoHelper = require('../helpers/mongo-helper');

const mongoHelper = new MongoHelper();

let uri = await mongoHelper.create();
let db = await mongoHelper.connect(uri);

class UpdateAccessTokenRepository {
	constructor(userModel) {
		this.userModel = userModel;
	}
	async update(id, accessToken) {
		await this.userModel.updateOne({ _id: id }, { $set: { accessToken } });
	}
}

describe('UpdateAccessToken Repository', () => {
	beforeAll(async () => {
		await mongoHelper.create();
		await mongoHelper.connect(uri);
	});
	beforeEach(async () => {
		db.collection('users').deleteMany();
	});

	afterAll(async () => {
		await mongoHelper.disconnect();
		await mongoHelper.stop();
	});

	it('Should update the user with the given accessToken', async () => {
		const userModel = db.collection('users');
		const sut = new UpdateAccessTokenRepository(userModel);
		const fakeUser = await userModel.insertOne({
			email: 'valid_email@email.com',
			name: '',
			age: 25,
			state: 'any_state',
			password: 'hashed_password',
		});

		await sut.update(fakeUser.insertedId, 'valid_token');
		let updatedFakeUser = await userModel.findOne({
			email: 'valid_email@email.com',
		});

		expect(updatedFakeUser.accessToken).toBe('valid_token');
	});

	it('Should throw if no usermodel is provided', async () => {
		const sut = new UpdateAccessTokenRepository();
		const userModel = db.collection('users');
		const fakeUser = await userModel.insertOne({
			email: 'valid_email@email.com',
			name: '',
			age: 25,
			state: 'any_state',
			password: 'hashed_password',
		});
		const promise = sut.update(fakeUser.insertedId, 'valid_token');
		expect(promise).rejects.toThrow();
	});
});
