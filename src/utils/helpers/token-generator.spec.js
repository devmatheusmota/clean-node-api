import { describe, it, expect } from 'vitest';
import MissingParamError from '../errors/missing-param-error';
import TokenGenerator from './token-generator';
const jwtSpy = require('../../../__mocks__/jsonwebtoken');

const makeSut = () => {
	return new TokenGenerator('secret');
};

describe('Token Generator', () => {
	it('Should return null if JWT returns null', async () => {
		const sut = makeSut();
		jwtSpy.token = null;
		await sut.generate('any_id');
		expect(jwtSpy.token).toBeNull();
	});

	it('Should return a token if JWT returns token', async () => {
		const sut = makeSut();
		const token = await sut.generate('any_id');
		jwtSpy.token = token;
		expect(token).toBe(jwtSpy.token);
	});

	it('Should call JWT with correct values', async () => {
		const sut = makeSut();
		await sut.generate('any_id');
		jwtSpy.sign('any_id', sut.secret);
		expect(jwtSpy.id).toBe(sut.id);
		expect(jwtSpy.secret).toBe(sut.secret);
	});

	it('Should throw if no secret is provided', async () => {
		const sut = new TokenGenerator();
		const promise = sut.generate('any_id');
		expect(promise).rejects.toThrow(new MissingParamError('secret'));
	});

	it('Should throw if no id is provided', async () => {
		const sut = makeSut();
		const promise = sut.generate();

		expect(promise).rejects.toThrow(new MissingParamError('id'));
	});
});
