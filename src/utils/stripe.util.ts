import Stripe from "stripe";
import environment from "../configs";

const stripe = new Stripe(environment.stripeKey, {
  apiVersion: "2022-11-15",
});

export const validateStripeAccount = async (ID: string) => {
  try {
    const account = await stripe.accounts.retrieve(ID);
    if (account.id === ID) return true;
    return false;
  } catch (error) {
    console.error("Error retrieving seller account ID:", error);
    return false;
  }
};

export const createPaymentFeeLink = async (
  id: any,
  price: number,
  sellerID: string
) => {
  const totalAmount = price;

  const platformFee = Math.ceil(totalAmount * 0.1);
  const product = await stripe.products.create({
    name: "Just Sell",
  });
  const prices = await stripe.prices.create({
    currency: "usd",
    unit_amount: price * 100,
    product: product.id,
  });
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: prices.id,
        quantity: 1,
      },
    ],
    application_fee_amount: platformFee,
    transfer_data: {
      destination: sellerID,
    },
    after_completion: {
      type: "redirect",
      redirect: {
        url: `${environment.frontEnd}/buyer/order/success/${id}`,
      },
    },
    invoice_creation: {
      enabled: true,
    },
  });
  // console.log(`${environment.frontEnd}/buyer/orders/success/${id}`);
  return paymentLink.url;
};

export const createPaymentLink = async (
  price: number,
  description: string,
  redirectUrl: string
) => {
  const product = await stripe.products.create({
    name: description,
  });
  const prices = await stripe.prices.create({
    currency: "usd",
    unit_amount: price * 100,
    product: product.id,
  });
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: prices.id,
        quantity: 1,
      },
    ],
    after_completion: {
      type: "redirect",
      redirect: {
        url: redirectUrl,
      },
    },
    invoice_creation: {
      enabled: true,
    },
  });
  return paymentLink.url;
};
