import express from 'express';
import users  from './users';
import members from './member';
import contacts from './contacts';
import subscribers from './subscribers';

const router = express.Router();

router.use('/api/users', users);
router.use('/api/members', members);
router.use('/api/contacts', contacts);
router.use('/api/subscribers', subscribers);

export default router;