import express from 'express';
import Joi from 'joi';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import calculateToken from '../helpers/token.js';
const router = express.Router();

const saltRounds = 10;
const schemaUser = Joi.object({
    email: Joi.string().email().required().trim(true),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required().trim(true),
    username: Joi.string().max(255)
});
const schemaUpdateUser = Joi.object({
    email: Joi.string().email().trim(true),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).trim(true),
    username: Joi.string().max(255)
});


router.post('/signup', async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const userIsValid = schemaUser.validate({ email, password, username });
        const userExists = await User.findByEmail(userIsValid.value.email);
        if (userIsValid.error) return res.status(422).json({ error: userIsValid.error.details[0].message });
        if (userExists) return res.json({ error: 'Email already exists' }).status(409);
        try {
            const hash = bcrypt.hashSync(userIsValid.value.password, saltRounds);
            userIsValid.value.password = hash;
            const userId = await User.createNew(userIsValid.value);
            const user = await User.findById(userId);
            res.status(201).json(user)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userIsValid = schemaUser.validate({ email, password });
        if (userIsValid.error) return res.status(422).json({ error: userIsValid.error.details[0].message });
        const userExists = await User.findByEmail(userIsValid.value.email);
        if (userExists) {
            const passwordIsValid = bcrypt.compareSync(userIsValid.value.password, userExists.password);
            if (passwordIsValid) {
                const token = calculateToken(userIsValid.value.email);
                res.status(200).send({ token: token, user: { email: userExists.email } });
            }
            else res.status(401).json({ error: 'Invalid password' });
        } else res.status(404).json({ error: 'User not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    const { email, password, username } = req.body;
    try {
        const userIsValid = await schemaUpdateUser.validate({
            email,
            password,
            username,
        });
        if (userIsValid.value.password) {
            const hash = bcrypt.hashSync(userIsValid.value.password, saltRounds);
            userIsValid.value.password = hash;
        }
        const userUpdate = await User.updateUser(req.params.id, userIsValid.value);
        if (userUpdate) res.status(201).json(userUpdate);
        else res.status(422).json({ message: error.message });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;