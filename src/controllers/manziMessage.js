import model from '../db/models';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const { Manzi } = model;

class ManziManager {

    static async viewManzi(req, res) {
        try {
            const message = await Manzi.findOne({ where: { id: req.params.id } });
            if (message) {
                return res.status(200).json({
                    Manzi: Manzi
                });
            }
            return res.status(404).json({
                message: 'Message does not exist'
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }

    }


    static async updateManzi(req, res) {
        try {
            const data = await Manzi.findOne({ where: { id: req.params.id } });
            const updated = await data.update({
                name: req.body.name || data.dataValues.name,
                email: req.body.email || data.dataValues.email,
                subject: req.body.subject || data.dataValues.message,
                message: req.body.message || data.dataValues.message
            });
            return res.status(200).json({
                Message: updated
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }


    static async getAllManzis(req, res) {
        try {
            const findManzis = await Manzi.findAll();
            if (findManzis) {
                return res.status(200).json({ total: findManzis.length, message: findManzis });
            }
            return res.status(400).json({ message: "No Message Found" });
        } catch (error) {
            return res.status(500).json({ error });
        }
    }

    static async addManzi(req, res) {
        const { name, email, subject, message } = req.body

        const output = `
                    <p>A new message from your Website</p>
                    <h3>Send Contact details</h3>
                    <ul>
                        <li>Name: ${name}</li>
                        <li>Email : ${email}</li>
                    </ul>
                    <h3>Subject</h3>
                    <p>${subject}</p>
                    <h3>Message</h3>
                    <p>${message}</p>
                `;

        try {
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                // secure: true,
                service: 'gmail',
                auth: {
                    type: "login",
                    user: process.env.HOST_EMAIL,
                    pass: process.env.HOST_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            // send mail with defined transport object
            let mailOptions = {
                from: '"Manzi Fabrice website" <mobicashmantis@gmail.com>',
                to: "manzif60@gmail.com",
                subject: "A new message from your Website",
                html: output
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error)
                }
                console.log("Message sent: %s", info.messageId);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            });
            await Manzi
                .create({
                    name,
                    email,
                    subject,
                    message
                })
            return res.status(201).send({ response: 'Message successfully created', name, email, subject, message, status: 201 });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                error,
            });
        }
    }

    static async deleteManzi(req, res) {
        try {
            const id = req.params.id
            const message = await Manzi.findOne({ where: { id } });
            if (message) {
                await Manzi.destroy({ where: { id } })
                return res.status(200).json({
                    message: 'Message deleted successfuly'
                });
            }
            return res.status(404).json({
                message: 'Message does not exist'
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

}

export default ManziManager;