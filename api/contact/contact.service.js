const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;
const asyncLocalStorage = require('../../services/als.service');

async function query() {
    try {
        const collection = await dbService.getCollection('contact');
        const contacts = await collection.find({}).toArray();
        return contacts;
    } catch (err) {
        logger.error('cannot find contacts', err);
        throw err;
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
        const store = asyncLocalStorage.getStore();
        const { contactId } = store;
        console.log(contactId);
        const collection = await dbService.getCollection('contact'); s
        const query = { _id: ObjectId(contactId) };
        await collection.deleteOne(query);
    } catch (err) {
        logger.error(`cannot remove contact ${contactId}`, err);
        throw err;
    }
}

async function add(contact) {
    try {
        // const contactToAdd = {
        //     buyer: contact.buyer,
        //     createdAt: contact.createdAt,
        //     guestsCount: contact.guestsCount,
        //     requests: contact.requests,
        //     status: contact.status,
        //     totalPrice: contact.totalPrice,
        //     tour: contact.tour,
        // };
        const collection = await dbService.getCollection('contact');
        // await collection.insertOne(contactToAdd);
        // return contactToAdd;
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
    update
};
