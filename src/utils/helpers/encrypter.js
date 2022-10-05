const bcrypt = require('bcrypt');
const MissingParamError = require('../errors/missing-param-error');

class Encrypter {
	async compare(value, hash) {
		if (!value) {
			throw new MissingParamError('value');
		}
		if (!hash) {
			throw new MissingParamError('hash');
		}
		this.value = value;
		this.hash = hash;

		const isValid = bcrypt.compare(value, hash);

		return isValid;
	}
}

module.exports = Encrypter;
