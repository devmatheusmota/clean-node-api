import { expect, describe, it, beforeAll, afterAll, beforeEach } from 'vitest';

const LoadUserByEmailRepository = require('./load-user-by-email-repository');

const MongoHelper = require('../helpers/mongo-helper');

const mongoHelper = new MongoHelper();

let uri = await mongoHelper.create();
let db = await mongoHelper.connect(uri);

const makeSut = () => {
	const userModel = db.collection('users');
	const sut = new LoadUserByEmailRepository(userModel);

	return { userModel, sut };
};

describe('LoadUserByEmail Repository', async () => {
	beforeEach(async () => {
		db.collection('users').deleteMany();
	});

	afterAll(async () => {
		await mongoHelper.disconnect();
		await mongoHelper.stop();
	});

	it('Should return null if no user is found', async () => {
		const { sut } = makeSut();
		const user = await sut.load('invalid_email@email.com');
		expect(user).toBeNull();
	});

	it('Should return an user if user is found', async () => {
		const { sut, userModel } = makeSut();
		// Creating an user
		await userModel.insertOne({
			email: 'valid_email@email.com',
			name: '',
			age: 25,
			state: 'any_state',
			password: 'hashed_password',
		});

		// Getting the same user from database
		const fakeUser = await userModel.findOne({
			email: 'valid_email@email.com',
		});

		const user = await sut.load('valid_email@email.com');
		expect(user).toEqual({
			_id: fakeUser._id,
			password: fakeUser.password,
		});
	});
});
