import Head from "next/head";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { SubscribeButton } from "../components/SubscribeButton";
import styles from "./home.module.scss";
import { stripe } from "../services/stripe";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  const showData = (dataset) => {
    const { idpart, nome } = dataset;
    console.log(idpart, nome);
  };

  return (
    <>
      <Head>
        <title>ig.news | home</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> World
          </h1>
          <p>
            Get Access to all publications
            <span>
              for{" "}
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(product.amount / 100)}{" "}
              month
            </span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <Image src="/images/avatar.svg" alt="Girl codiging" layout="fill" />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const prices = await stripe.prices.retrieve("price_1JG8vOLn11l5QYPkej07GAjl");

  return {
    props: {
      product: {
        priceId: prices.product,
        amount: prices.unit_amount,
      },
    },
  };
};
