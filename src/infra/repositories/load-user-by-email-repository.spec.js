import { expect, describe, it, beforeAll, afterAll, beforeEach } from 'vitest';

const MissingParamError = require('../../utils/errors/missing-param-error');

const LoadUserByEmailRepository = require('./load-user-by-email-repository');

const MongoHelper = require('../helpers/mongo-helper');

const mongoHelper = new MongoHelper();

let uri = await mongoHelper.create();
let db = await mongoHelper.connect(uri);

const makeSut = () => {
	return new LoadUserByEmailRepository(uri);
};

describe('LoadUserByEmail Repository', async () => {
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

	it('Should return null if no user is found', async () => {
		const sut = makeSut();
		const user = await sut.load('invalid_email@email.com');
		expect(user).toBeNull();
	});

	it('Should return an user if user is found', async () => {
		const sut = makeSut();
		// Creating an user
		const { insertedId } = await db.collection('users').insertOne({
			email: 'valid_email@email.com',
			name: '',
			age: 25,
			state: 'any_state',
			password: 'hashed_password',
		});

		// Getting the same user from database
		const fakeUser = await db.collection('users').findOne({
			_id: insertedId,
		});

		const user = await sut.load('valid_email@email.com');

		expect(user).toEqual({
			_id: fakeUser._id,
			password: fakeUser.password,
		});
	});

	it('Should throw if no email is provided', async () => {
		const sut = makeSut();
		const promise = sut.load();
		expect(promise).rejects.toThrow(new MissingParamError('email'));
	});
});
