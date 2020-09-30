import model from '../db/models';

const { Member } = model;

class MemberManager {

    static async viewMember(req, res) {
        try {
            const member = await Member.findOne({ where: { id: req.params.id } });
            if (member) {
                return res.status(200).json({
                    member: member
                });
            }
            return res.status(404).json({
                message: 'Member does not exist'
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
        
    }


    static async updateMember(req, res) {
        try {
            const data = await Member.findOne({ where: { id: req.params.id } });
            const updated = await data.update({
              name: req.body.name || data.dataValues.name,
              type: req.body.type || data.dataValues.type,
              website: req.body.website || data.dataValues.website,
              owner: req.body.owner || data.dataValues.owner,
              email: req.body.email || data.dataValues.email,
              phonenumber: req.body.phonenumber || data.dataValues.phonenumber,
              address: req.body.address || data.dataValues.address
            });
            return res.status(200).json({
              member: updated
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }


    static async getAllMembers(req, res) {
        try {
            const findMembers = await Member.findAll();
            let casino = 0
            let Sports  = 0
            let Gaming  = 0
            let Internet = 0
            let lottery = 0
            if (findMembers) {
                findMembers.map((item) => {
                    if (item.type === 'Casino') {
                        casino = casino + 1
                    }
                    if (item.type === 'Sports betting') {
                        Sports = Sports + 1
                    }
                    if (item.type === 'Gaming machine') {
                        Gaming = Gaming + 1
                    }
                    if (item.type === 'Internet Gaming') {
                        Internet = Internet + 1
                    }
                    if (item.type === 'Lottery') {
                        lottery = lottery + 1
                    }
                })
                return res.status(200).json({ total: findMembers.length, casino, Sports, Gaming, Internet, lottery, members: findMembers });
            }
            return res.status(400).json({ message: "No Members Found" });
        } catch (error) {
            return res.status(500).json({ error });
        }
    }

    static async addMember(req, res) {
        const { name, type, website, owner, email, phonenumber, address } = req.body

        try {
            const findMember = await Member.findOne({
                where: { name }
            });
            if (findMember) {
                return res.status(400).json({
                    message: 'Member already exists.'
                });
            }
            await Member
                .create({
                    name,
                    type,
                    website,
                    owner,
                    email,
                    phonenumber,
                    address
                })
            return res.status(201).send({ message: 'Member successfully created', name, type, website, owner, email, phonenumber, address });
        } catch (error) {
            return res.status(400).json({
                status: 400,
                error,
            });
        }
    }

    static async deleteMember(req, res) {
            try {
                const id = req.params.id
                const member = await Member.findOne({ where: { id } });
                if (member) {
                    await Member.destroy({ where: { id } })
                    return res.status(200).json({
                        message: 'Member deleted successfuly'
                    });
                }
                return res.status(404).json({
                    message: 'Application does not exist'
                });
            } catch (error) {
                return res.status(400).json({
                    message: error.message
                });
            }
    }

}

export default MemberManager;