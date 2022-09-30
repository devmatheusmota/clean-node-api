const { MissingParamError } = require('../../utils/errors');
const AuthUseCase = require('./auth-usecase');
import { describe, expect, it } from 'vitest';

describe('Auth UseCase', () => {
	it('Should throw if no email is provided', async () => {
		const sut = new AuthUseCase();
		const promise = sut.auth();

		expect(promise).rejects.toThrow(new MissingParamError('email'));
	});

	it('Should throw if no password is provided', async () => {
		const sut = new AuthUseCase();
		const promise = sut.auth('any_email@email.com');

		expect(promise).rejects.toThrow(new MissingParamError('password'));
	});

	it('Should call LoadUserByEmailRepository with correct email', async () => {
		class LoadUserByEmailRepositorySpy {
			async load(email) {
				this.email = email;
			}
		}
		const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
		const sut = new AuthUseCase(loadUserByEmailRepositorySpy);
		await sut.auth('any_email@email.com', 'any_password');

		expect(loadUserByEmailRepositorySpy.email).toBe('any_email@email.com');
	});
});
