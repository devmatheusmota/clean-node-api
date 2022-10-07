const cors = require('../middlewares/cors');
const jsonParser = require('../middlewares/json-parser');
const contenType = require('../middlewares/content-type');

module.exports = (app) => {
	app.disable('x-powered-by');
	app.use(cors);
	app.use(jsonParser);
	app.use(contenType);
};
