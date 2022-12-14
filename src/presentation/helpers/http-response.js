const { ServerError, UnauthorizedError } = require('../errors/');
module.exports = class HttpResponse {
	static ok(accessToken) {
		return {
			statusCode: 200,
			body: accessToken,
		};
	}

	static badRequest(error) {
		return {
			statusCode: 400,
			body: { error: error.message },
		};
	}
	static serverError() {
		return {
			statusCode: 500,
			body: { error: new ServerError().message },
		};
	}
	static unauthorizedError() {
		return {
			statusCode: 401,
			body: { error: new UnauthorizedError().message },
		};
	}
};
