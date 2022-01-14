import express from 'express';
import contacts from '../controllers/contacts';
import verifyUser from '../middleware/verifyUser';

const route = express.Router();

route.post('/', contacts.addContact);
route.get('/contacts/:id', contacts.viewContact);
route.get('/contacts', contacts.getAllContacts);
route.delete('/contacts/:id', verifyUser.isAdmin, contacts.deleteContact);
route.patch('/contacts/:id', verifyUser.isAdmin, contacts.updateContact);

export default route;
