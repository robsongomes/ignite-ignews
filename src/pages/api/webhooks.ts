import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { SubscriptionRepository } from "./_lib/SubscriptionRepository";
import { UserRepository } from "./_lib/UserRepository";

async function toBuffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.deleted",
]);

export default async function webhooks(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log("Evento recebido");
    const stripe_sign = req.headers["stripe-signature"];

    let event: Stripe.Event;
    const subRepo = new SubscriptionRepository();
    const userRepo = new UserRepository();

    const buf = await toBuffer(req);
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        stripe_sign,
        process.env.STRIPE_WEBHOOK_KEY
      );

      if (relevantEvents.has(event.type)) {
        if (event.type === "checkout.session.completed") {
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          const user = await userRepo.findByCustomerId(
            checkoutSession.customer.toString()
          );
          const subscription = await stripe.subscriptions.retrieve(
            checkoutSession.subscription.toString()
          );

          await subRepo.create(subscription, user);
        } else if (event.type === "customer.subscription.deleted") {
          const subscription = event.data.object as Stripe.Subscription;
          await subRepo.cancel(subscription);
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send(`Webhook error: ${error.message}`);
    }

    res.status(200).json({ ok: true });
  } else {
    req.headers = {
      Allow: "POST",
    };
    return res.status(405).send("Method not allowed");
  }
}
