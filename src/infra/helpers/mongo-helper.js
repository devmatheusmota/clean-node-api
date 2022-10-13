const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

module.exports = {
	async create() {
		if (!this.mongoServer) {
			this.mongoServer = await MongoMemoryServer.create();
		}
		this.uri = this.mongoServer.getUri();
	},

	async connect() {
		if (!this.client) {
			this.client = await MongoClient.connect(this.uri);
		}
		this.db = this.client.db();
	},

	async disconnect() {
		await this.client.close();
	},
	async stop() {
		await this.mongoServer.stop();
	},

	async getCollection(name) {
		if (!this.client) {
			await this.connect(this.uri);
		}
		return this.db.collection(name);
	},
};
