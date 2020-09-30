import model from '../db/models';

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

        try {
            const findSubscriber = await Subscriber.findOne({
                where: { email }
            });
            if (findSubscriber) {
                return res.status(400).json({
                    message: 'Subscriber already exists.'
                });
            }
            await Subscriber
                .create({
                    email
                })
            return res.status(201).send({ message: 'Subscriber successfully created', email });
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