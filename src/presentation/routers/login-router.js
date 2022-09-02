const HttpResponse = require('../helpers/http-response');
const fs = require('fs');
const MissingParamError = require('../helpers/missing-param-error');

module.exports = class LoginRouter {
	constructor(authUseCase) {
		this.authUseCase = authUseCase;
	}
	async route(httpRequest) {
		try {
			const { email, password } = httpRequest.body;
			if (!email) {
				return HttpResponse.badRequest(new MissingParamError('email'));
			}

			if (!password) {
				return HttpResponse.badRequest(new MissingParamError('password'));
			}
			const accessToken = await this.authUseCase.auth(email, password);
			if (!accessToken) {
				return HttpResponse.unauthorizedError();
			}
			return HttpResponse.ok({ accessToken });
		} catch (error) {
			const date = new Date();
			fs.appendFile('error-log.txt', `${date} ${error}\n`, (err) => {
				if (err) throw err;
			});
			return HttpResponse.serverError();
		}
	}
};
