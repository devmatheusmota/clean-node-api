const { MissingParamError } = require('../../utils/errors/');
module.exports = class AuthUseCase {
	async auth(email) {
		if (!email) {
			throw new MissingParamError('email');
		}
	}
};
