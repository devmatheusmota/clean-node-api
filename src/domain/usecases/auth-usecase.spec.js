const AuthUseCase = require('./auth-usecase');

describe('Auth UseCase', () => {
	test('Should return null if no email is provided', async () => {
		const sut = new AuthUseCase();
		const promisse = sut.auth();
		expect(promisse).rejects.toThrow();
	});
});
