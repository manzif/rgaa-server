import express from 'express';
import members from '../controllers/members';
import verifyUser from '../middleware/verifyUser';

const route = express.Router();

route.post('/', members.addMember);
route.get('/members/:id', members.viewMember);
route.get('/members', members.getAllMembers);
route.delete('/members/:id', verifyUser.isAdmin, members.deleteMember);
route.patch('/members/:id', verifyUser.isAdmin, members.updateMember);


export default route;