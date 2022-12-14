const { MissingParamError } = require('../../utils/errors');
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

const makeEncrypterWithError = () => {
	class EncrypterSpy {
		async compare() {
			throw new Error();
		}
	}

	return new EncrypterSpy();
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

const makeTokenGeneratorWithError = () => {
	class TokenGeneratorSpy {
		async generate() {
			throw new Error();
		}
	}

	return new TokenGeneratorSpy();
};

const makeLoadUserByEmailRepository = () => {
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

const makeloadUserByEmailRepositoryWithError = () => {
	class LoadUserByEmailRepositorySpy {
		async load() {
			throw new Error();
		}
	}
	return new LoadUserByEmailRepositorySpy();
};

const makeUpdateAccessTokenRepository = () => {
	class UpdateAccessTokenRepositorySpy {
		async update(userId, acessToken) {
			this.userId = userId;
			this.acessToken = acessToken;
		}
	}

	return new UpdateAccessTokenRepositorySpy();
};

const makeUpdateAcessTokenRepositoryWithError = () => {
	class UpdateAccessTokenRepositorySpy {
		async update() {
			throw new Error();
		}
	}

	return new UpdateAccessTokenRepositorySpy();
};

const makeSut = () => {
	const encrypterSpy = makeEncrypter();
	const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository();
	const tokenGeneratorSpy = makeTokenGenerator();
	const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository();
	const sut = new AuthUseCase({
		loadUserByEmailRepository: loadUserByEmailRepositorySpy,
		encrypter: encrypterSpy,
		tokenGenerator: tokenGeneratorSpy,
		updateAccessTokenRepository: updateAccessTokenRepositorySpy,
	});
	return {
		sut,
		loadUserByEmailRepositorySpy,
		encrypterSpy,
		tokenGeneratorSpy,
		updateAccessTokenRepositorySpy,
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

		expect(tokenGeneratorSpy.userId).toEqual(
			loadUserByEmailRepositorySpy.user._id
		);
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

	it('Should call UpdateAcessTokenRepository with correct values', async () => {
		const {
			sut,
			loadUserByEmailRepositorySpy,
			updateAccessTokenRepositorySpy,
			tokenGeneratorSpy,
		} = makeSut();

		await sut.auth('valid_email@email.com', 'valid_password');
		expect(updateAccessTokenRepositorySpy.userId).toBe(
			loadUserByEmailRepositorySpy.user._id
		);
		expect(updateAccessTokenRepositorySpy.acessToken).toBe(
			tokenGeneratorSpy.acessToken
		);
	});

	it('Should throw if invalid dependencies are provided', async () => {
		const invalid = {};
		const loadUserByEmailRepository = makeLoadUserByEmailRepository();
		const encrypter = makeEncrypter();
		const tokenGenerator = makeTokenGenerator();

		const suts = [].concat(
			new AuthUseCase(),
			new AuthUseCase({}),
			new AuthUseCase({
				loadUserByEmailRepository: invalid,
			}),
			new AuthUseCase({
				loadUserByEmailRepository,
			}),
			new AuthUseCase({
				loadUserByEmailRepository,
				encrypter: invalid,
			}),
			new AuthUseCase({
				loadUserByEmailRepository,
				encrypter,
			}),
			new AuthUseCase({
				loadUserByEmailRepository,
				encrypter,
				tokenGenerator: invalid,
			}),
			new AuthUseCase({
				loadUserByEmailRepository,
				encrypter,
				tokenGenerator,
			}),
			new AuthUseCase({
				loadUserByEmailRepository,
				encrypter,
				tokenGenerator,
				updateAccessTokenRepository: invalid,
			})
		);

		for (const sut of suts) {
			const promise = sut.auth('any_email@email.com', 'any_password');

			expect(promise).rejects.toThrow();
		}
	});

	it('Should throw if any of dependencies throw', async () => {
		const loadUserByEmailRepository = makeLoadUserByEmailRepository();
		const encrypter = makeEncrypter();
		const tokenGenerator = makeTokenGenerator();

		const suts = [].concat(
			new AuthUseCase({
				loadUserByEmailRepository: makeloadUserByEmailRepositoryWithError(),
			}),
			new AuthUseCase({
				loadUserByEmailRepository,
				encrypter: makeEncrypterWithError(),
			}),
			new AuthUseCase({
				loadUserByEmailRepository,
				encrypter,
				tokenGenerator: makeTokenGeneratorWithError(),
			}),
			new AuthUseCase({
				loadUserByEmailRepository,
				encrypter,
				tokenGenerator,
				updateAccessTokenRepository: makeUpdateAcessTokenRepositoryWithError(),
			})
		);

		for (const sut of suts) {
			const promise = sut.auth('any_email@email.com', 'any_password');

			expect(promise).rejects.toThrow();
		}
	});
});
