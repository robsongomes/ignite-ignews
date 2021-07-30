import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { query as q } from "faunadb";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  data: {
    stripe_customer_id: string;
  };
  ref: {
    id: string;
  };
};

export default async function subscribe(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    //criar o cliente no stripe a partir do user da app
    const session = await getSession({ req });

    // buscar o usuário do faunadb
    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("users_by_email"), q.Casefold(session.user.email)))
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        })
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckout = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: "price_1JG8vOLn11l5QYPkej07GAjl",
          quantity: 1,
        },
      ],
      billing_address_collection: "required",
      payment_method_types: ["card"],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return res.status(200).json({ sessionId: stripeCheckout.id });
  } else {
    req.headers = {
      Allow: "POST",
    };
    return res.status(405).send("Method not allowed");
  }
}
