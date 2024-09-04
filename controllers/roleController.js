const Role = require('../models/role');

exports.createRole = async (req, res) =>{
    try{
        const {name} = req.body;

        let existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ message: 'Role already exists'});

        }

        const newRole = new Role({ name });
        await newRole.save();

        res.status(201).json({message: 'Role created successfully'});
    } catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server Error'});
    }
};