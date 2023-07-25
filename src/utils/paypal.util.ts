import paypal from "paypal-rest-sdk";

// Configure PayPal SDK with your client ID and secret
paypal.configure({
  mode: "sandbox",
  client_id: "YOUR_CLIENT_ID",
  client_secret: "YOUR_CLIENT_SECRET",
});

// Function to generate a PayPal payment link
async function generatePayPalPaymentLink(
  description: string,
  price: number,
  redirectUrl: string
): Promise<string> {
  const createPayment = () =>
    new Promise<paypal.Payment>((resolve, reject) => {
      const paymentRequest: paypal.Payment = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: redirectUrl,
          cancel_url: redirectUrl,
        },
        transactions: [
          {
            description,
            amount: {
              currency: "USD",
              total: price.toFixed(2),
            },
          },
        ],
      };

      paypal.payment.create(paymentRequest, (error, payment) => {
        if (error) {
          reject(error);
        } else {
          resolve(payment);
        }
      });
    });

  const payment = await createPayment();
  const paymentLink = payment.links.find((link) => link.method === "REDIRECT");
  if (paymentLink) {
    return paymentLink.href;
  } else {
    throw new Error("Unable to retrieve PayPal payment link.");
  }
}

// Usage
const description = "Product description";
const price = 10.99;
const redirectUrl = "https://example.com/return-url";

generatePayPalPaymentLink(description, price, redirectUrl)
  .then((paymentLink) => {
    console.log("PayPal payment link:", paymentLink);
  })
  .catch((error) => {
    console.error("Error generating PayPal payment link:", error);
  });
