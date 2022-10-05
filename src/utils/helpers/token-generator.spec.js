import { describe, it, expect } from 'vitest';
const jwt = require('jsonwebtoken');
const jwtSpy = require('../../../__mocks__/jsonwebtoken');
class TokenGenerator {
	constructor(secret) {
		this.secret = secret;
	}
	async generate(id) {
		this.id = id;
		return jwt.sign(id, this.secret);
	}
}

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
});
