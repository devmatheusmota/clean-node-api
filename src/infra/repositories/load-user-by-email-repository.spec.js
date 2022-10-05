import { expect, describe, it } from 'vitest';

class LoadUserByEmailRepository {
	async load(email) {
		return null;
	}
}

describe('LoadUserByEmail Repository', () => {
	it('Should return null if no user is found', async () => {
		const sut = new LoadUserByEmailRepository();
		const user = await sut.load('invalid_email@email.com');
		expect(user).toBeNull();
	});
});
