import Stripe from "stripe";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is required but was not found in env variables"
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripePaymentIntent = async (
  req: Request,
  res: Response
): Promise<void> => {
  let { amount } = req.body;

  if (!amount || amount <= 0) {
    amount = 50; // min Stripe amount in cents
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never"
      }
    });

    res.json({
      message: "",
      data: {
        clientSecret: paymentIntent.client_secret
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Stripe payment intent", error });
  }
};

// export const listTransactions = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const { userId } = req.query;

//   try {
//     const transactions = userId
//       ? await Transaction.query("userId").eq(userId).exec()
//       : await Transaction.scan().exec();

//     res.json({
//       message: "Transactions retrieved successfully",
//       data: transactions
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving transactions", error });
//   }
// };
