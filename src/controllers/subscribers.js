import model from '../db/models';
import Helper from '../helper/helper';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

const { Subscriber } = model;

class SubscriberManager {

    static async updateSubscriber(req, res) {
        try {
            const data = await Subscriber.findOne({ where: { id: req.params.id } });
            const updated = await data.update({
                email: req.body.email || data.dataValues.email
            });
            return res.status(200).json({
                Subscriber: updated
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }


    static async getAllSubscribers(req, res) {
        try {
            const findSubscribers = await Subscriber.findAll();
            if (findSubscribers) {
                return res.status(200).json({ total: findSubscribers.length, subscribers: findSubscribers });
            }
            return res.status(400).json({ message: "No Subscriber Found" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async addSubscriber(req, res) {
        const { email } = req.body
        const output = `
                    <p>A new subscriber has joined Rwanda Gaming Assiociation Website</p>
                    <h3>Subscriber Contact details</h3>
                    <ul>
                        <li>Email : ${email}</li>
                    </ul>
                `;

        if (!Helper.isValidEmail(email)) {
            return res.status(400).send({ 'message': 'Please enter a valid email address' });
        }

        try {
            const findSubscriber = await Subscriber.findOne({
                where: { email }
            });
            if (findSubscriber) {
                return res.status(400).json({
                    message: 'Subscriber already exists.'
                });
            }
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
                from: '"RGAA website" <mobicashmantis@gmail.com>',
                to: "rwandagamingassociation@gmail.com",
                subject: "A new subscriber has joined RGAA Website",
                html: output
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error)
                }
                console.log("Message sent: %s", info.messageId);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            });
            await Subscriber
                .create({
                    email
                })
            return res.status(201).send({ message: 'Subscriber successfully created', email, status: 201 });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                error,
            });
        }
    }

    static async deleteSubscriber(req, res) {
        try {
            const id = req.params.id
            const subscriber = await Subscriber.findOne({ where: { id } });
            if (subscriber) {
                await Subscriber.destroy({ where: { id } })
                return res.status(200).json({
                    message: 'Subscriber deleted successfuly'
                });
            }
            return res.status(404).json({
                message: 'Subscriber does not exist'
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

}

export default SubscriberManager;