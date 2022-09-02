const ServerError = require('./server-error');
const UnauthorizedError = require('./unauthorized-error');
module.exports = class HttpResponse {
	static badRequest(error) {
		return {
			statusCode: 400,
			body: error,
		};
	}
	static serverError() {
		return {
			statusCode: 500,
			body: new ServerError(),
		};
	}
	static unauthorizedError() {
		return {
			statusCode: 401,
			body: new UnauthorizedError(),
		};
	}
	static ok(accessToken) {
		return {
			statusCode: 200,
			body: accessToken,
		};
	}
};
