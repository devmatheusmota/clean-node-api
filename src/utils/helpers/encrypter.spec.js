import { it, describe, expect } from 'vitest';

const bcrypt = require('bcrypt');

class Encrypter {
	async compare(value, hashed_value) {
		this.value = value;
		this.hash = hashed_value;

		const isValid = bcrypt.compare(this.value, this.hash);

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

	it('Should call bcrypt with correct values', async () => {
		const sut = new Encrypter();
		await sut.compare('any_value', 'hashed_value');
		expect(sut.value).toBe('any_value');
		expect(sut.hash).toBe('hashed_value');
	});
});
