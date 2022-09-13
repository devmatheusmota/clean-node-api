const { MissingParamError } = require('../../utils/errors');
const AuthUseCase = require('./auth-usecase');

describe('Auth UseCase', () => {
	test('Should throw if no email is provided', async () => {
		const sut = new AuthUseCase();
		const promise = sut.auth();

		expect(promise).rejects.toThrow(new MissingParamError('email'));
	});
});
