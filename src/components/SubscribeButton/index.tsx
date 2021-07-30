import styles from "./styles.module.scss";
import { api } from "../../services/api";
import { signIn, useSession } from "next-auth/client";
import { getStripeJs } from "../../services/stripe-js";
import { useRouter } from "next/dist/client/router";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton(props: SubscribeButtonProps) {
  const [session] = useSession();
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!session.user) {
      signIn("github");
      return;
    }

    if (session?.activeSubscription) {
      router.push("/posts");
      return;
    }

    const res = await api.post("subscribe");
    const { sessionId } = res.data;
    const stripe = await getStripeJs();

    stripe.redirectToCheckout({ sessionId });
  };
  return (
    <button
      onClick={handleSubscribe}
      className={styles.subscribeButton}
      type="button"
    >
      Subscribe now
    </button>
  );
}
