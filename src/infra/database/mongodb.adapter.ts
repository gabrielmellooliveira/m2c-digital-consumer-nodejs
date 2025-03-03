import { Collection, MongoClient } from 'mongodb';

export default class MongoDbAdapter {
  mongoClient: MongoClient;
  uri: string;

  constructor(uri: string, databaseName: string) {
    this.uri = `${uri}/${databaseName}`;
    this.mongoClient = new MongoClient(this.uri);
  }

  async connect(): Promise<void> {
    this.mongoClient = await MongoClient.connect(this.uri);
  }

  async disconnect(): Promise<void> {
    await this.mongoClient.close();
  }

  getCollection(name: string): Collection {
    return this.mongoClient.db().collection(name);
  }
}