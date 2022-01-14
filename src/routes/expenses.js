import express from 'express';
import expenses from '../controllers/expenses';
import verifyUser from '../middleware/verifyUser';

const route = express.Router();

route.post('/', expenses.addExpense);
route.get('/expenses/:id', expenses.viewExpense);
route.get('/expenses', expenses.getAllExpenses);
route.delete('/expenses/:id', expenses.deleteExpense);
route.patch('/expenses/:id', expenses.updateExpense);

export default route;
