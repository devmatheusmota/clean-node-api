const { MissingParamError, InvalidParamError } = require('../../utils/errors');
const AuthUseCase = require('./auth-usecase');
import { describe, expect, it } from 'vitest';

const makeSut = () => {
	class EncrypterSpy {
		async compare(password, hashedPassword) {
			this.password = password;
			this.hashedPassword = hashedPassword;
		}
	}
	const encrypterSpy = new EncrypterSpy();
	class LoadUserByEmailRepositorySpy {
		async load(email) {
			this.email = email;
			return this.user;
		}
	}
	const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
	loadUserByEmailRepositorySpy.user = {
		password: 'hashed_password',
	};
	const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy);
	return {
		sut,
		loadUserByEmailRepositorySpy,
		encrypterSpy,
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

	it('Should return null if an invalid email is provided', async () => {
		const { sut, loadUserByEmailRepositorySpy } = makeSut();
		loadUserByEmailRepositorySpy.user = null;
		const acessToken = await sut.auth(
			'invalid_email@email.com',
			'any_password'
		);
		expect(acessToken).toBeNull();
	});

	it('Should return null if an invalid password is provided', async () => {
		const { sut } = makeSut();
		const acessToken = await sut.auth(
			'valid_email@email.com',
			'invalid_password'
		);
		expect(acessToken).toBeNull();
	});

	it('Should call Encrypter with correct values', async () => {
		const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();
		await sut.auth('valid_email@email.com', 'any_password');
		expect(encrypterSpy.password).toBe('any_password');
		expect(encrypterSpy.hashedPassword).toBe(
			loadUserByEmailRepositorySpy.user.password
		);
	});
});
