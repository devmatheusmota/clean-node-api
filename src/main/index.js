const MongoHelper = require('../infra/helpers/mongo-helper');
const env = require('../main/config/env');

MongoHelper.create().then((uri) => {
	MongoHelper.connect(uri)
		.then(() => {
			const app = require('./config/app');

			app.listen(env.port, () =>
				console.log(`Server running at http://localhost:${env.port}`)
			);
		})
		.catch(console.error);
});
