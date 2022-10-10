const MissingParamError = require('../../utils/errors/missing-param-error');
const MongoHelper = require('../helpers/mongo-helper');

class UpdateAccessTokenRepository extends MongoHelper {
	constructor(uri) {
		super();
		this.uri = uri;
	}
	async update(id, accessToken) {
		if (!id) {
			throw new MissingParamError('userId');
		}
		if (!accessToken) {
			throw new MissingParamError('accessToken');
		}
		const db = await this.connect(this.uri);

		await db
			.collection('users')
			.updateOne({ _id: id }, { $set: { accessToken } });
	}
}

module.exports = UpdateAccessTokenRepository;
