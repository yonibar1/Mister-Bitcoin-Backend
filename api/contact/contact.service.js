const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;
const asyncLocalStorage = require('../../services/als.service');

async function query() {
    try {
        const collection = await dbService.getCollection('contact');
        const contacts = await collection.find({}).toArray();
        // const contacts = await collection.find({})
        return contacts;
    } catch (err) {
        logger.error('cannot find contacts', err);
        throw err;
    }
}

async function getById(id) {
    try {
        const collection = await dbService.getCollection('contact');
        const contact = await collection.findOne({ _id: ObjectId(id) });
        console.log(contact, 'Contact');
        return contact
    } catch (err) {
        console.log(err, 'ERR');
    }
}

async function update(contact) {
    try {
        contact._id = ObjectId(contact._id);
        const collection = await dbService.getCollection('contact');
        await collection.updateOne({ _id: contact._id }, { $set: contact });
        return contact;
    } catch (err) {
        console.log('err:', err);
    }
}
async function remove(contactId) {
    try {
        const collection = await dbService.getCollection('contact');
        const query = { _id: ObjectId(contactId) };
        await collection.deleteOne(query);
    } catch (err) {
        logger.error(`cannot remove contact ${contactId}`, err);
        throw err;
    }
}

async function add(contact) {
    try {
        const collection = await dbService.getCollection('contact');
        await collection.insertOne(contact);
        return contact;
    } catch (err) {
        logger.error('cannot insert contact', err);
        throw err;
    }
}

module.exports = {
    query,
    remove,
    add,
    update,
    getById
};
