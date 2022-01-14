import model from '../db/models';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const { Contact } = model;

class ContactManager {

    static async viewContact(req, res) {
        try {
            const contact = await Contact.findOne({ where: { id: req.params.id } });
            if (contact) {
                return res.status(200).json({
                    contact: contact
                });
            }
            return res.status(404).json({
                message: 'Contact does not exist'
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }

    }


    static async updateContact(req, res) {
        try {
            const data = await Contact.findOne({ where: { id: req.params.id } });
            const updated = await data.update({
                name: req.body.name || data.dataValues.name,
                email: req.body.email || data.dataValues.email,
                subject: req.body.subject || data.dataValues.message,
                message: req.body.message || data.dataValues.message
            });
            return res.status(200).json({
                contact: updated
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }


    static async getAllContacts(req, res) {
        try {
            const findContacts = await Contact.findAll();
            if (findContacts) {
                return res.status(200).json({ total: findContacts.length, message: findContacts });
            }
            return res.status(400).json({ message: "No Message Found" });
        } catch (error) {
            return res.status(500).json({ error });
        }
    }

    static async addContact(req, res) {
        const { name, email, subject, message } = req.body

        const output = `
                    <p>A new message from Rwanda Gaming Assiociation Website</p>
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
                from: '"RGAA website" <mobicashmantis@gmail.com>',
                to: "rwandagamingassociation@gmail.com",
                subject: "A new message from RGAA Website",
                html: output
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error)
                }
                console.log("Message sent: %s", info.messageId);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            });
            await Contact
                .create({
                    name,
                    email,
                    subject,
                    message
                })
            return res.status(201).send({ response: 'Contact successfully created', name, email, subject, message, status: 201 });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                error,
            });
        }
    }

    static async deleteContact(req, res) {
        try {
            const id = req.params.id
            const contact = await Contact.findOne({ where: { id } });
            if (contact) {
                await Contact.destroy({ where: { id } })
                return res.status(200).json({
                    message: 'Contact deleted successfuly'
                });
            }
            return res.status(404).json({
                message: 'Contact does not exist'
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

}

export default ContactManager;
