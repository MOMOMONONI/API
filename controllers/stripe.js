require("dotenv").config(); // ✅ โหลด .env ก่อน
const prisma = require("../config/prisma");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // ✅ ดึงจาก .env

exports.payment = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: req.user.id,
      },
    });

    const amountTHB = cart.cartTotal * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountTHB,
      currency: "thb",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
