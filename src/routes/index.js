import express from 'express';
import users  from './users';
import members from './member';
import contacts from './contacts';
import expenses from './expenses';
import subscribers from './subscribers';
import manzis from './manzi';

const router = express.Router();

router.use('/api/users', users);
router.use('/api/members', members);
router.use('/api/contacts', contacts);
router.use('/api/subscribers', subscribers);
router.use('/api/manzis', manzis);
router.use('/api/expenses', expenses);

export default router;