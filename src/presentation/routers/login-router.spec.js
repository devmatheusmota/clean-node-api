describe('Login Router', () => {
	test(`Should return 400 if there's no email in request body. `, () => {
		const sut = new LoginRouter();
		const httpRequest = {};
		const httpResponse = sut.route(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
	});
});
