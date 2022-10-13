const MissingParamError = require('../../utils/errors/missing-param-error');
const mongoHelper = require('../helpers/mongo-helper');
class UpdateAccessTokenRepository {
	async update(id, accessToken) {
		if (!id) {
			throw new MissingParamError('userId');
		}
		if (!accessToken) {
			throw new MissingParamError('accessToken');
		}
		const userModel = await mongoHelper.getCollection('users');
		await userModel.updateOne({ _id: id }, { $set: { accessToken } });
	}
}

module.exports = UpdateAccessTokenRepository;
