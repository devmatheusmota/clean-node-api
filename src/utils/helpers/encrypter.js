const bcrypt = require('bcrypt');

class Encrypter {
	async compare(value, hashed_value) {
		this.value = value;
		this.hash = hashed_value;

		const isValid = bcrypt.compare(this.value, this.hash);

		return isValid;
	}
}

module.exports = Encrypter;
