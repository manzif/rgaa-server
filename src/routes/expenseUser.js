import express from 'express';
import expenseUser from '../controllers/expensesUser';
import verifyUser from '../middleware/verifyUser';

const route = express.Router();

route.post('/', expenseUser.signUp);
route.get('/',  expenseUser.getAllExpenseUsers);
route.patch('/users/:id', expenseUser.updateExpenseUser);
route.post('/login', expenseUser.login);

export default route;
