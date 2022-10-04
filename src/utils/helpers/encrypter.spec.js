import { it, describe, expect, vi, beforeEach, afterEach } from 'vitest';
const bcrypt = require('bcrypt');

class Encrypter {
	async compare(value, hash) {
		const isValid = await bcrypt.compare(value, hash);

		return isValid;
	}
}

describe('Encrypter', () => {
	it('Should return true if bcrypt returns true', async () => {
		const sut = new Encrypter();

		let isValid = await sut.compare('any_value', 'hashed_value');
		isValid = true;
		expect(isValid).toBe(true);
	});

	it('Should return false if bcrypt returns false', async () => {
		const sut = new Encrypter();
		const isValid = await sut.compare('any_value', 'hashed_value');
		expect(isValid).toBe(false);
	});
});
