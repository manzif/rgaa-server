import express from 'express';
import manzis from '../controllers/manziMessage';
import verifyUser from '../middleware/verifyUser';

const route = express.Router();

route.post('/', manzis.addManzi);
route.get('/contacts/:id', manzis.viewManzi);
route.get('/contacts', manzis.getAllManzis);
route.delete('/contacts/:id', verifyUser.isAdmin, manzis.deleteManzi);
route.patch('/contacts/:id', verifyUser.isAdmin, manzis.updateManzi);

export default route;