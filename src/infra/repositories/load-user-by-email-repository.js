const MissingParamError = require('../../utils/errors/missing-param-error');
const mongoHelper = require('../helpers/mongo-helper');

class LoadUserByEmailRepository {
	async load(email) {
		if (!email) {
			throw new MissingParamError('email');
		}
		const userModel = await mongoHelper.getCollection('users');
		const user = await userModel.findOne(
			{ email },
			{
				projection: {
					password: 1,
				},
			}
		);

		return user;
	}
}
module.exports = LoadUserByEmailRepository;
