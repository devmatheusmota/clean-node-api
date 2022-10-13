import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
const MissingParamError = require('../../utils/errors/missing-param-error');

const UpdateAccessTokenRepository = require('./update-access-token-repository');

const mongoHelper = require('../helpers/mongo-helper');

let userModel;
let fakeUserId;

const makeSut = () => {
	return new UpdateAccessTokenRepository();
};

describe('UpdateAccessToken Repository', () => {
	beforeAll(async () => {
		await mongoHelper.create();
		await mongoHelper.connect();
		userModel = await mongoHelper.getCollection('users');
	});
	beforeEach(async () => {
		let userModel = await mongoHelper.getCollection('users');
		await userModel.deleteMany();
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

		let updatedFakeUser = await userModel.findOne({
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
