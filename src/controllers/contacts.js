import model from '../db/models';

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

        try {
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