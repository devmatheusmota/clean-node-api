const { MissingParamError, InvalidParamError } = require('../../utils/errors');
const AuthUseCase = require('./auth-usecase');
import { describe, expect, it } from 'vitest';

const makeSut = () => {
	class LoadUserByEmailRepositorySpy {
		async load(email) {
			this.email = email;
		}
	}
	const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
	const sut = new AuthUseCase(loadUserByEmailRepositorySpy);
	return {
		sut,
		loadUserByEmailRepositorySpy,
	};
};

describe('Auth UseCase', () => {
	it('Should throw if no email is provided', async () => {
		const { sut } = makeSut();
		const promise = sut.auth();

		expect(promise).rejects.toThrow(new MissingParamError('email'));
	});

	it('Should throw if no password is provided', async () => {
		const { sut } = makeSut();
		const promise = sut.auth('any_email@email.com');

		expect(promise).rejects.toThrow(new MissingParamError('password'));
	});

	it('Should call LoadUserByEmailRepository with correct email', async () => {
		const { sut, loadUserByEmailRepositorySpy } = makeSut();
		await sut.auth('any_email@email.com', 'any_password');

		expect(loadUserByEmailRepositorySpy.email).toBe('any_email@email.com');
	});

	it('Should throw if no LoadUserByEmailRepository is provided', async () => {
		const sut = new AuthUseCase();
		const promise = sut.auth('any_email@email.com', 'any_password');

		expect(promise).rejects.toThrow(
			new MissingParamError('loadUserByEmailRepository')
		);
	});

	it('Should throw if LoadUserByEmailRepository has no load method', async () => {
		const sut = new AuthUseCase({});
		const promise = sut.auth('any_email@email.com', 'any_password');

		expect(promise).rejects.toThrow(
			new InvalidParamError('loadUserByEmailRepository')
		);
	});

	it('Should return null if LoadUserByEmailRepository returns null', async () => {
		const { sut } = makeSut();
		const acessToken = await sut.auth(
			'invalid_email@email.com',
			'any_password'
		);

		expect(acessToken).toBeNull();
	});
});
