import { MissingParamError } from '../../utils/errors';

class UpdateAccessTokenRepository {
	constructor(userModel) {
		this.userModel = userModel;
	}
	async update(id, accessToken) {
		if (!id) {
			throw new MissingParamError('userId');
		}
		if (!accessToken) {
			throw new MissingParamError('accessToken');
		}
		await this.userModel.updateOne({ _id: id }, { $set: { accessToken } });
	}
}

module.exports = UpdateAccessTokenRepository;
