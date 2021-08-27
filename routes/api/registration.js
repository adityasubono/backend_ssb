const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Registration = require('../../models/Registration');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/register
// @desc     Post data register
// @access   Public
router.post(
    '/',
    check('name', 'Masukan Nama Anda').notEmpty(),
    check('address', 'Masukan Alamat Rumah Anda').notEmpty(),
    check('dob', 'Masukan Tanggal Lahir Anda').notEmpty(),
    check('height', 'Masukan Tinggi Badan Anda').notEmpty(),
    check('weight', 'Masukan Berat Badan Anda').notEmpty(),
    check('salary', 'Masukan Pendapatan Orang Tua Anda').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, address, dob, height, weight, salary } = req.body;

        try {
            registration = new Registration({
                name,
                address,
                dob,
                height,
                weight,
                salary
            });

            await registration.save();
            res.status(200).send('Successful Registration ');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


// @route    GET api/register
// @desc     Register User
// @access   Public
router.get('/', async (req, res) => {
    try {
        const register = await Registration.find().populate('registration', ['name', 'address','dob','height','weight','salary']);
        res.json(register);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route    GET api/register/:register_id
// @desc     Get register by register_id
// @access   Public
router.get(
    '/:register_id',

    checkObjectId('register_id'),
    async ({ params: { register_id } }, res) => {
        try {
            const registration = await Registration.findOne({
                _id : register_id
            }).populate('registration', ['name', 'address','dob','height','weight','salary']);

            if (!registration) return res.status(400).json({ msg: 'Registration not found' });

            return res.json(registration);
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ msg: 'Server error' });
        }
    }
);


// @route    PUT api/register
// @desc     Add profile experience
// @access   Public
router.put(
    '/',
    check('name', 'Masukan Nama Anda').notEmpty(),
    check('address', 'Masukan Alamat Rumah Anda').notEmpty(),
    check('dob', 'Masukan Tanggal Lahir Anda').notEmpty(),
    check('height', 'Masukan Tinggi Badan Anda').notEmpty(),
    check('weight', 'Masukan Berat Badan Anda').notEmpty(),
    check('salary', 'Masukan Pendapatan Orang Tua Anda').notEmpty(),


    async (req, res) => {
        checkObjectId(req.body._id)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {

            await Registration.findOneAndUpdate({ _id: req.body._id }, req.body);

            res.status(200).send('Data Registrasi Berhasil Diubah');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


// @route    DELETE api/register/:register_id
// @desc     Delete register
// @access   Public

router.delete('/:id', async (req, res) => {
    try {
        await Promise.all([
            Registration.findOneAndRemove({ _id: req.params.id })
        ]);

        return res.status(200).json({ msg: 'Data Registrasi Berhasil Dihapus' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
