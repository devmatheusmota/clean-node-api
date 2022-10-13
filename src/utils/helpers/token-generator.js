const jwt = require('jsonwebtoken');
const MissingParamError = require('../errors/missing-param-error');

class TokenGenerator {
	constructor(secret) {
		this.secret = secret;
	}
	async generate(id) {
		if (!this.secret) {
			throw new MissingParamError('secret');
		}
		if (!id) {
			throw new MissingParamError('id');
		}
		this.id = id;

		return jwt.sign(id.toString(), this.secret);
	}
}

module.exports = TokenGenerator;
