import { it, describe, expect } from 'vitest';

const MissingParamError = require('../errors/missing-param-error');
const Encrypter = require('./encrypter');
const makeSut = () => {
	return new Encrypter();
};

describe('Encrypter', () => {
	it('Should return true if bcrypt returns true', async () => {
		const sut = makeSut();

		let isValid = await sut.compare('any_value', 'hashed_value');
		isValid = true;
		expect(isValid).toBe(true);
	});

	it('Should return false if bcrypt returns false', async () => {
		const sut = makeSut();
		const isValid = await sut.compare('any_value', 'hashed_value');
		expect(isValid).toBe(false);
	});

	it('Should call bcrypt with correct values', async () => {
		const sut = makeSut();
		await sut.compare('any_value', 'hashed_value');
		expect(sut.value).toBe('any_value');
		expect(sut.hash).toBe('hashed_value');
	});

	it('Should throw if no params are provided.', async () => {
		const sut = makeSut();
		expect(sut.compare()).rejects.toThrow(new MissingParamError('value'));
		expect(sut.compare('any_value')).rejects.toThrow(
			new MissingParamError('hash')
		);
	});
});
