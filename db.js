
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert') 
//Create a database named "mydb":
const url = "mongodb://localhost:27017";
const database = "flagbrew"

function connect(callback) {
	MongoClient.connect(url, {useNewUrlParser: true}, callback)
}


function insert_data(collectionName, data, name) {
	// connect to the database
	connect(function (err, client) {
		let db = client.db(database)
		assert.equal(null, err);
		console.log("inserting data please wait!")

		let collection = db.collection(collectionName)

		try {
			console.log(name)
			collection.updateOne({ "name": name, }, {$set: data}, {upsert: true})
		} catch(e) {
			console.log(e)
		}
		// close the connection after we're done
		console.log("data inserted, closing connection!")
		client.close()
	})
}

function fetch_all(collectionName, callback) {
	connect(function (err, client) {
		let db = client.db(database)
		assert.equal(null, err);
		let collection = db.collection(collectionName)
		collection.find({}).toArray(function (err, result) {
			assert.equal(null, err);
			callback(result)
		})
		client.close()
	})
}


function fetch_one(collectionName, name, callback) {
	connect(function (err, client) {
		let db = client.db(database)
		assert.equal(null, err);
		let collection = db.collection(collectionName)
		collection.findOne({name: name}, function (err, result) {
			assert.equal(null, err);
			callback(result)
		})
		client.close()
	})
}
module.exports = {
	insert: function (collection, data, name) {
		insert_data(collection, data, name)
	},
	get_all: function (collection, callback) {
		fetch_all(collection, callback)
	},
	get_one: function (collection, name, callback) {
		fetch_one(collection, name, callback)
	}
};
