import express from 'express';
import subscribers from '../controllers/subscribers';
import verifyUser from '../middleware/verifyUser';

const route = express.Router();

route.post('/', subscribers.addSubscriber);
route.get('/subscribers', subscribers.getAllSubscribers);
route.delete('/subscribers/:id', verifyUser.isAdmin, subscribers.deleteSubscriber);
route.patch('/subscribers/:id', verifyUser.isAdmin, subscribers.updateSubscriber);


export default route;