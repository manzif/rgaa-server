import model from '../db/models';
import dotenv from 'dotenv';

const { expenseData } = model;

class ExpenseManager {

    static async viewExpense(req, res) {
        let totalCost = 0
        try {
            // const header = req.headers['authorization'];
            // const bearer = header.split(' ');
            // const token = bearer[1];
            // req.token = token;
            // const { id } = await Helper.verifyToken(token);
            const findExpenses = await expenseData.findAll({ where: { userId: req.params.id } });
            if (findExpenses) {
                findExpenses.map((item) => {
                    totalCost = totalCost + item.price
                })
                return res.status(200).json({ total: findExpenses.length, totalSpent: totalCost, expenses: findExpenses });
            }
            return res.status(404).json({
                message: 'Expense does not exist'
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }

    }


    static async updateExpense(req, res) {
        try {
            const data = await expenseData.findOne({ where: { id: req.params.id } });
            const updated = await data.update({
                title: req.body.title || data.dataValues.title,
                price: req.body.price || data.dataValues.price,
                date: req.body.date || data.dataValues.date
            });
            return res.status(200).json({
                expense: updated
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }


    static async getAllExpenses(req, res) {
        let totalCost = 0
        try {
            const findExpenses = await expenseData.findAll();
            if (findExpenses) {
                findExpenses.map((item) => {
                    totalCost = totalCost + item.price
                })
                return res.status(200).json({ total: findExpenses.length, totalSpent: totalCost, message: findExpenses });
            }
            return res.status(400).json({ message: "No Expenses Found" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async addExpense(req, res) {
        const { title, price, date, userId } = req.body

        try {
            await expenseData
                .create({
                    title,
                    price,
                    date,
                    userId
                })
            return res.status(201).send({ response: 'Expense successfully added', title, price, date });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: error.message,
            });
        }
    }

    static async deleteExpense(req, res) {
        try {
            const id = req.params.id
            const expense = await expenseData.findOne({ where: { id } });
            if (expense) {
                await expenseData.destroy({ where: { id } })
                return res.status(200).json({
                    message: 'Expense deleted successfuly'
                });
            }
            return res.status(404).json({
                message: 'Expense does not exist'
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

}

export default ExpenseManager;
