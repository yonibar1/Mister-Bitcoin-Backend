const logger = require('../../services/logger.service');
const contactService = require('./contact.service');

async function getContacts(req, res) {
    try {
        const contacts = await contactService.query(req.query);
        res.send(contacts);
    } catch (err) {
        logger.error('Cannot get contacts', err);
        res.status(500).send({ err: 'Failed to get contacts' });
    }
}

async function deleteContact(req, res) {
    try {
        await contactService.remove(req.params.id);
        res.send({ msg: 'Deleted successfully' });
    } catch (err) {
        logger.error('Failed to delete contact', err);
        res.status(500).send({ err: 'Failed to delete contact' });
    }
}
async function updateContact(req, res) {
    const contact = contactService.update(req.body)
    res.send(contact)
}

async function addContact(req, res) {
    try {
        var contact = req.body;
        contact = await contactService.add(contact);
        res.send(contact);
    } catch (err) {
        logger.error('Failed to add contact', err);
        res.status(500).send({ err: 'Failed to add contact' });
    }
}

module.exports = {
    getContacts,
    deleteContact,
    addContact,
    updateContact
};
