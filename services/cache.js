const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const exec = mongoose.Query.prototype.exec;
const redisUrl = 'redis://127.0.0.1:6379';

const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

mongoose.Query.prototype.cache = function() {
    this.useCache = true;
    return this;
};

mongoose.Query.prototype.exec = async function() {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }
    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        })
    );
    const cachedValue = await client.get(key);
    if (cachedValue) {
        const doc = JSON.parse(cachedValue);
        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    } else {
        const newValue = exec.apply(this, arguments);
        client.set(key, JSON.stringify(newValue), 'EX', 10);
        return newValue;
    }
};
