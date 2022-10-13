const { adapt } = require('../adapters/express-router-adapter');
const LoginRouterComposer = require('../composers/login-router-composer');

module.exports = async (router) => {
	// const uri = await mongoHelper.create();
	// const db = await mongoHelper.connect(uri);
	// const userModel = db.collection('users');
	// userModel.insertOne({
	// 	email: 'valid_email@email.com',
	// 	password: bcrypt.hashSync('hashed_password', 10),
	// });

	router.post('/login', adapt(LoginRouterComposer.compose()));
};
