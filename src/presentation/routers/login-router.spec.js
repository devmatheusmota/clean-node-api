class LoginRouter {
	route(httpRequest) {
		const { email, password } = httpRequest.body;
		if (!email || !password) {
			return {
				statusCode: 400,
			};
		}
	}
}

describe('Login Router', () => {
	test(`Should return 400 if there's no email in request body. `, () => {
		const sut = new LoginRouter();
		const httpRequest = {
			body: {
				password: 'any_password',
			},
		};
		const httpResponse = sut.route(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
	});
});

describe('Login Router', () => {
	test(`Should return 400 if there's no password in request body. `, () => {
		const sut = new LoginRouter();
		const httpRequest = {
			body: {
				email: 'any_email@mail.com',
			},
		};
		const httpResponse = sut.route(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
	});
});
