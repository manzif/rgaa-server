import model from '../db/models';
import Helper from '../helper/helper';

const { expenseUser } = model;

class ExpensesUsers {

  static async signUp(req, res) {

    const { name, email, password } = req.body
    const hashPassword = Helper.hashPassword(password);
    try {
      const findUser = await expenseUser.findOne({
        where: { email }
      });
      if(findUser){
        return res.status(400).json({
          message: 'User already exists.'
        });
      }
      await expenseUser
      .create({
        name,
        email,
        password: hashPassword
      })
      const payload = { email, name }
      const token = Helper.generateToken(payload);
      return res.status(201).send({ token, message: 'User successfully created', name, email});
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
    });
    }
  }

  static async login(req, res) {
    try {
      const findUser = await expenseUser.findOne({ where: { email: req.body.email } });
      
      if (findUser) {
        const userData = {
          id: findUser.dataValues.id,
          name: findUser.dataValues.name,
          email: findUser.dataValues.email,
          password: findUser.dataValues.password
        };
        const hashPassword = findUser.dataValues.password
        const password = req.body.password
        if (Helper.comparePassword(hashPassword, password)) {
          const payload = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
          }
          const token = Helper.generateToken(payload);
          return res.status(200).json({
            message: 'You have been successfully logged in',
            token: token,
            user: {
              email: payload.email,
              name: payload.name,
              id: userData.id,

            }
          });
        }
        return res.status(400).json({
          status: 400,
          message: 'Wrong email or password'
        });
      }
      return res.status(400).json({
        status: 400,
        message: 'Wrong email or password'
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }

  static async updateExpenseUser(req, res) {
    try {
      const data = await expenseUser.findOne({ where: { id: req.params.id } });
      const oldPassword = data.dataValues.password
      
      const { name, email, password } = req.body
      if (Helper.comparePassword(oldPassword, password)) {
      }
      const hashPassword = Helper.hashPassword(password);
      const updated = await data.update({
        name: name || data.dataValues.name,
        password: hashPassword || data.dataValues.password,
        email: email || data.dataValues.email,
      });
      return res.status(200).json({
        user: updated
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  static async getAllExpenseUsers(req, res) {
    try {
      const findUsers = await expenseUser.findAll();
      if (findUsers) {
        return res.status(200).json({ total: findUsers.length, users: findUsers });
      }
      return res.status(400).json({ message: "No User Found" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }


}

export default ExpensesUsers;
