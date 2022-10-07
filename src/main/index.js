const MongoHelper = require('../infra/helpers/mongo-helper');

let mongoHelper = new MongoHelper();

mongoHelper.create().then((uri) => {
	mongoHelper
		.connect(uri)
		.then(() => {
			const app = require('./config/app');

			app.listen(3000, () =>
				console.log('Server running at http://localhost:3000')
			);
		})
		.catch(console.error);
});
