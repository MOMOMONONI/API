const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.register = async (req, res) => {
    try {
        const { email, password, name, address, phone } = req.body;

        // Validate
        if (!email || !password || !name || !address || !phone) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Check email exists
        const existingUser = await prisma.user.findFirst({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists!' });
        }

        // Check phone exists
        const existingPhone = await prisma.user.findFirst({ where: { phone } });
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone already exists!' });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create user
        await prisma.user.create({
            data: {
                email,
                password: hashPassword,
                name,
                address,
                phone,           // <- สำคัญ
                // picture,      // ไม่ต้องส่ง มี default
                // role,         // ไม่ต้องส่ง มี default
                // enabled,      // ไม่ต้องส่ง มี default
            },
        });

        res.send('Register Success');
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.login = async (req, res) => {
    try {
        //code
        const { email, password } = req.body
        // Step 1 Check Email
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (!user || !user.enabled) {
            return res.status(400).json({ message: 'User Not found or not Enabled' })
        }
        // Step 2 Check password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Password Invalid!!!' })
        }
        // Step 3 Create Payload
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }
        // Step 4 Generate Token
        jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: "Server Error" })
            }
            res.json({ payload, token })

        })
    } catch (err) {
        // err
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}
exports.currentUser = async (req, res) => {
    try {
        //code
        const user = await prisma.user.findFirst({
            where: { email: req.user.email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        })
        res.json({ user })
    } catch (err) {
        //err
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}
