const MongoHelper = require('../infra/helpers/mongo-helper');
const env = require('../main/config/env');

let mongoHelper = new MongoHelper();

mongoHelper.create().then((uri) => {
	mongoHelper
		.connect(uri)
		.then(() => {
			const app = require('./config/app');

			app.listen(env.port, () =>
				console.log(`Server running at http://localhost:${env.port}`)
			);
		})
		.catch(console.error);
});
