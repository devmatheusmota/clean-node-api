const LoginRouter = require('./login-router');
const { UnauthorizedError, ServerError } = require('../errors');
const { MissingParamError, InvalidParamError } = require('../../utils/errors');

import { describe, expect, it } from 'vitest';

const makeSut = () => {
	const authUseCaseSpy = makeAuthUseCase();
	const emailValidatorSpy = makeEmailValidator();
	authUseCaseSpy.accessToken = 'valid_token';
	const sut = new LoginRouter({
		authUseCase: authUseCaseSpy,
		emailValidator: emailValidatorSpy,
	});
	return {
		sut,
		authUseCaseSpy,
		emailValidatorSpy,
	};
};

const makeEmailValidator = () => {
	class EmailValidatorSpy {
		isValid(email) {
			this.email = email;
			return this.isEmailValid;
		}
	}
	const emailValidatorSpy = new EmailValidatorSpy();
	emailValidatorSpy.isEmailValid = true;
	return emailValidatorSpy;
};

const makeEmailValidatorWithError = () => {
	class EmailValidatorSpy {
		isValid() {
			throw new Error();
		}
	}
	return new EmailValidatorSpy();
};

const makeAuthUseCase = () => {
	class AuthUseCaseSpy {
		async auth(email, password) {
			this.email = email;
			this.password = password;
			return this.accessToken;
		}
	}
	const authUseCaseSpy = new AuthUseCaseSpy();
	authUseCaseSpy.accessToken = 'valid_token';
	return authUseCaseSpy;
};

const makeAuthUseCaseWithError = () => {
	class AuthUseCaseSpy {
		async auth() {
			throw new Error();
		}
	}
	return new AuthUseCaseSpy();
};

describe('Login Router', () => {
	it(`Should return 400 if there's no email in request body. `, async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				password: 'any_password',
			},
		};
		const httpResponse = await sut.route(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body.error).toBe(
			new MissingParamError('email').message
		);
	});

	it(`Should return 400 if there's no password in request body. `, async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: 'any_email@mail.com',
			},
		};
		const httpResponse = await sut.route(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body.error).toBe(
			new MissingParamError('password').message
		);
	});

	it(`Should return 500 if no httpRequest is provided`, async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.route();
		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body.error).toBe(new ServerError().message);
	});

	it(`Should return 500 if httpRequest has no body`, async () => {
		const { sut } = makeSut();
		const httpRequest = {};
		const httpResponse = await sut.route(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body.error).toBe(new ServerError().message);
	});

	it(`Should call AuthUseCase with correct params`, async () => {
		const { sut, authUseCaseSpy } = makeSut();
		const httpRequest = {
			body: {
				email: 'any_email@email.com',
				password: 'any_password',
			},
		};
		await sut.route(httpRequest);
		expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
		expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
	});

	it(`Should return 401 when invalid credentials are provided`, async () => {
		const { sut, authUseCaseSpy } = makeSut();
		authUseCaseSpy.accessToken = null;
		const httpRequest = {
			body: {
				email: 'invalid_email@email.com',
				password: 'invalid_password',
			},
		};
		const httpResponse = await sut.route(httpRequest);
		expect(httpResponse.statusCode).toBe(401);
		expect(httpResponse.body.error).toBe(new UnauthorizedError().message);
	});

	it(`Should return 200 when valid credentials are provided`, async () => {
		const { sut, authUseCaseSpy } = makeSut();
		const httpRequest = {
			body: {
				email: 'valid_email@email.com',
				password: 'valid_password',
			},
		};
		const httpResponse = await sut.route(httpRequest);
		expect(httpResponse.statusCode).toBe(200);
		expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
	});

	it(`Should return 400 if an invalid email is provided. `, async () => {
		const { sut, emailValidatorSpy } = makeSut();
		emailValidatorSpy.isEmailValid = false;
		const httpRequest = {
			body: {
				email: 'invalid_email@mail.com',
				password: 'any_password',
			},
		};
		const httpResponse = await sut.route(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body.error).toBe(
			new InvalidParamError('email').message
		);
	});

	it(`Should call EmailValidator with correct email`, async () => {
		const { sut, emailValidatorSpy } = makeSut();
		const httpRequest = {
			body: {
				email: 'any_email@email.com',
				password: 'any_password',
			},
		};
		await sut.route(httpRequest);
		expect(emailValidatorSpy.email).toBe(httpRequest.body.email);
	});

	it('Should throw if invalid dependencies are provided', async () => {
		const invalid = {};
		const authUseCase = makeAuthUseCase();
		const suts = [].concat(
			new LoginRouter(),
			new LoginRouter({}),
			new LoginRouter({
				authUseCase: invalid,
			}),
			new LoginRouter({
				authUseCase: authUseCase,
			}),
			new LoginRouter({
				authUseCase: authUseCase,
				emailValidator: invalid,
			})
		);

		for (const sut of suts) {
			const httpRequest = {
				body: {
					email: 'any_email@email.com',
					password: 'any_password',
				},
			};
			const httpResponse = await sut.route(httpRequest);
			expect(httpResponse.statusCode).toBe(500);
			expect(httpResponse.body.error).toBe(new ServerError().message);
		}
	});

	it('Should throw if any of dependencies throw', async () => {
		const authUseCase = makeAuthUseCase();
		const suts = [].concat(
			new LoginRouter({
				authUseCase: makeAuthUseCaseWithError(),
			}),
			new LoginRouter({
				authUseCase: authUseCase,
				emailValidator: makeEmailValidatorWithError(),
			})
		);

		for (const sut of suts) {
			const httpRequest = {
				body: {
					email: 'any_email@email.com',
					password: 'any_password',
				},
			};
			const httpResponse = await sut.route(httpRequest);
			expect(httpResponse.statusCode).toBe(500);
			expect(httpResponse.body.error).toBe(new ServerError().message);
		}
	});
});
