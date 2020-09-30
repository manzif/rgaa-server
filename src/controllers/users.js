import model from '../db/models';
import Helper from '../helper/helper';

const { User } = model;

class Users {
  static async signUp(req, res) {

    const { username, email, role, firstname, lastname, password } = req.body
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }
    const hashPassword = Helper.hashPassword(password);
    try {
      const findUser = await User.findOne({
        where: { email }
      });
      if(findUser){
        return res.status(400).json({
          message: 'User already exists.'
        });
      }
      await User
      .create({
        username,
        email,
        role,
        firstname,
        lastname,
        password: hashPassword
      })
      const payload = {email, username, role, firstname, lastname}
      const token = Helper.generateToken(payload);
      return res.status(201).send({ token, message: 'User successfully created', username, email});
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error,
    });
    }
  }

  static async login(req, res) {
    try {
      const findUser = await User.findOne({ where: { email: req.body.email } });
      
      if (findUser) {
        const userData = {
          id: findUser.dataValues.id,
          username: findUser.dataValues.username,
          email: findUser.dataValues.email,
          role: findUser.dataValues.role,
          firstname: findUser.dataValues.firstname,
          lastname: findUser.dataValues.lastname,
          password: findUser.dataValues.password
        };
        const hashPassword = findUser.dataValues.password
        const password = req.body.password
        if (Helper.comparePassword(hashPassword, password)) {
          const payload = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            role: userData.role,
          }
          const token = Helper.generateToken(payload);
          return res.status(200).json({
            message: 'You have been successfully logged in',
            token: token,
            user: {
              email: payload.email,
              username: payload.username,
              role: userData.role,
              id: userData.id,
              lastname: userData.lastname,
              firstname: userData.firstname

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

  static async getAllusers(req, res) {
    try {
      const findUsers = await User.findAll();
      let admin = 0
      let developer = 0
      let guest = 0
      if (findUsers) {
        findUsers.map((item) => {
          if (item.role === 'admin') {
            admin = admin + 1
          }
          if (item.role === 'developer') {
            developer = developer + 1
          }
          if (item.role === 'guest') {
            guest = guest + 1
          }
        })
        return res.status(200).json({ total: findUsers.length, admin, developer, guest, users: findUsers });
      }
      return res.status(400).json({ message: "No User Found" });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  static async deleteUser(req, res) {
    try {
      const id = req.params.id
      const user = await User.findOne({ where: { id } });
      if (user) {
        await User.destroy({ where: { id } })
        return res.status(200).json({
          message: 'User deleted successfuly'
        });
      }
      return res.status(404).json({
        message: 'User does not exist'
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }


}

export default Users;
