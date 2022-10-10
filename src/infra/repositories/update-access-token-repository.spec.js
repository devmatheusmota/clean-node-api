import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
const MissingParamError = require('../../utils/errors/missing-param-error');

const UpdateAccessTokenRepository = require('./update-access-token-repository');

const MongoHelper = require('../helpers/mongo-helper');

const mongoHelper = new MongoHelper();

let uri = await mongoHelper.create();
let db = await mongoHelper.connect(uri);

const makeSut = () => {
	return new UpdateAccessTokenRepository(uri);
};

describe('UpdateAccessToken Repository', () => {
	let fakeUserId;
	beforeAll(async () => {
		await mongoHelper.create();
		await mongoHelper.connect(uri);
	});
	beforeEach(async () => {
		let userModel = db.collection('users');
		userModel.deleteMany();
		const fakeUser = await userModel.insertOne({
			email: 'valid_email@email.com',
			name: '',
			age: 25,
			state: 'any_state',
			password: 'hashed_password',
		});
		fakeUserId = fakeUser.insertedId;
	});

	afterAll(async () => {
		await mongoHelper.disconnect();
		await mongoHelper.stop();
	});

	it('Should update the user with the given accessToken', async () => {
		const sut = makeSut();

		await sut.update(fakeUserId, 'valid_token');

		let updatedFakeUser = await db.collection('users').findOne({
			_id: fakeUserId,
		});

		expect(updatedFakeUser.accessToken).toBe('valid_token');
	});

	it('Should throw if no params are provided', async () => {
		const sut = makeSut();

		expect(sut.update()).rejects.toThrow(new MissingParamError('userId'));
		expect(sut.update(fakeUserId)).rejects.toThrow(
			new MissingParamError('accessToken')
		);
	});
});
