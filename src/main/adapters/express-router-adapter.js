module.exports = class ExpressRouterAdapter {
	static adapt(router) {
		return async (req, res) => {
			const httpRequest = {
				body: req.body,
			};
			const httResponse = await router.route(httpRequest);
			res.status(HttpResponse.statusCode).json(httResponse.body);
		};
	}
};
