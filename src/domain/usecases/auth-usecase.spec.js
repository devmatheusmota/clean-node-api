const { MissingParamError, InvalidParamError } = require('../../utils/errors');
const AuthUseCase = require('./auth-usecase');
import { describe, expect, it } from 'vitest';

const makeEncrypter = () => {
	class EncrypterSpy {
		async compare(password, hashedPassword) {
			this.password = password;
			this.hashedPassword = hashedPassword;
			return this.isValid;
		}
	}

	const encrypterSpy = new EncrypterSpy();
	encrypterSpy.isValid = true;

	return encrypterSpy;
};

const makeTokenGenerator = () => {
	class TokenGeneratorSpy {
		async generate(userId) {
			this.userId = userId;
			return this.acessToken;
		}
	}

	const tokenGeneratorSpy = new TokenGeneratorSpy();
	tokenGeneratorSpy.acessToken = 'any_token';
	return tokenGeneratorSpy;
};

const makeloadUserByEmailRepository = () => {
	class LoadUserByEmailRepositorySpy {
		async load(email) {
			this.email = email;
			return this.user;
		}
	}
	const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
	loadUserByEmailRepositorySpy.user = {
		id: 'any_id',
		password: 'hashed_password',
	};
	return loadUserByEmailRepositorySpy;
};

const makeSut = () => {
	const encrypterSpy = makeEncrypter();
	const loadUserByEmailRepositorySpy = makeloadUserByEmailRepository();
	const tokenGeneratorSpy = makeTokenGenerator();
	const sut = new AuthUseCase({
		loadUserByEmailRepository: loadUserByEmailRepositorySpy,
		encrypter: encrypterSpy,
		tokenGenerator: tokenGeneratorSpy,
	});
	return {
		sut,
		loadUserByEmailRepositorySpy,
		encrypterSpy,
		tokenGeneratorSpy,
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
		const { sut, encrypterSpy } = makeSut();

		encrypterSpy.isValid = false;
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

	it('Should call TokenGenerator with correct userId', async () => {
		const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();

		await sut.auth('valid_email@email.com', 'valid_password');

		expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id);
	});

	it('Should return an acessToken if correct credentials are provided', async () => {
		const { sut, tokenGeneratorSpy } = makeSut();

		const acessToken = await sut.auth(
			'valid_email@email.com',
			'valid_password'
		);

		expect(acessToken).toBe(tokenGeneratorSpy.acessToken);
		expect(acessToken).toBeTruthy();
	});

	it('Should throw if invalid dependencies are provided', async () => {
		const invalid = {};
		const loadUserByEmailRepository = makeloadUserByEmailRepository();
		const encrypter = makeEncrypter();

		const suts = [].concat(
			new AuthUseCase(),
			new AuthUseCase({
				loadUserByEmailRepository: null,
				encrypter: null,
				tokenGenerator: null,
			}),
			new AuthUseCase({
				loadUserByEmailRepository: invalid,
				encrypter: null,
				tokenGenerator: null,
			}),
			new AuthUseCase({
				loadUserByEmailRepository,
				encrypter: null,
				tokenGenerator: null,
			}),
			new AuthUseCase({
				loadUserByEmailRepository,
				encrypter: invalid,
				tokenGenerator: null,
			}),
			new AuthUseCase({
				loadUserByEmailRepository,
				encrypter,
				tokenGenerator: null,
			}),
			new AuthUseCase({
				loadUserByEmailRepository,
				encrypter,
				tokenGenerator: invalid,
			})
		);

		for (const sut of suts) {
			const promise = sut.auth('any_email@email.com', 'any_password');

			expect(promise).rejects.toThrow();
		}
	});
});
