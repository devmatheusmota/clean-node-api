module.exports = class AuthUseCase {
	async auth(email) {
		if (!email) {
			throw new Error();
		}
	}
};
