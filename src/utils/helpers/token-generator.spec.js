import { describe, it, expect } from 'vitest';
const jwt = require('jsonwebtoken');
const jwtSpy = require('../../../__mocks__/jsonwebtoken');
class TokenGenerator {
	async generate(id) {
		return jwt.sign(id, 'secret');
	}
}

describe('Token Generator', () => {
	it('Should return null if JWT returns null', async () => {
		const sut = new TokenGenerator();
		jwtSpy.token = null;
		const token = await sut.generate('any_id');
		expect(jwtSpy.token).toBeNull();
	});

	it('Should return a token if JWT returns token', async () => {
		const sut = new TokenGenerator();
		const token = await sut.generate('any_id');
		jwtSpy.token = token;
		expect(token).toBe(jwtSpy.token);
	});
});
