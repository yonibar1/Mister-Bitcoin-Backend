const express = require('express');
// const { requireAuth } = require('../../middlewares/requireAuth.middleware');
// const { log } = require('../../middlewares/logger.middleware');
const { updateContact, addContact, getContacts, deleteContact } = require('./contact.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getContacts);
router.post('/', addContact)
// router.put('/', requireAuth, updateContact);
router.put('/', updateContact);
// router.delete('/:id', requireAuth, deleteContact)
router.delete('/:id', deleteContact)


module.exports = router;
