const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

class MongoHelper {
	async create() {
		this.mongod = await MongoMemoryServer.create();
		this.uri = this.mongod.getUri();
		return this.uri;
	}

	async connect(uri) {
		this.uri = uri;
		this.client = await MongoClient.connect(uri);
		this.db = this.client.db();
		return this.db;
	}

	async disconnect() {
		await this.client.close();
	}
	async stop() {
		await this.mongod.stop();
	}
}

module.exports = MongoHelper;
