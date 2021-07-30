import { query as q } from "faunadb";
import Stripe from "stripe";
import { fauna } from "../../../services/fauna";
import { User } from "./UserRepository";

export class SubscriptionRepository {
  async create(
    subscription: Stripe.Subscription,
    user: User
  ): Promise<Stripe.Subscription> {
    const subscriptionData = {
      id: subscription.id,
      userId: user.ref,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
    };

    return fauna.query(
      q.Create(q.Collection("subscriptions"), { data: subscriptionData })
    );
  }

  async update(
    subscription: Stripe.Subscription,
    user: User
  ): Promise<Stripe.Subscription> {
    const subscriptionData = {
      id: subscription.id,
      userId: user.ref,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
    };
    return fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("subscriptions_by_id"), subscription.id))
        ),
        { data: subscriptionData }
      )
    );
  }

  async cancel(
    subscription: Stripe.Subscription
  ): Promise<Stripe.Subscription> {
    return fauna.query(
      q.Update(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("subscriptions_by_id"), subscription.id))
        ),
        { data: { status: subscription.status } }
      )
    );
  }
}
