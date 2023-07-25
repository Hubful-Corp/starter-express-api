import axios, { AxiosResponse } from "axios";

async function generatePayoneerCheckoutLink(
  amount: number,
  returnUrl: string,
  description: string
): Promise<string> {
  const apiKey = "YOUR_API_KEY";
  const apiSecret = "YOUR_API_SECRET";
  const apiUrl = "https://api.payoneer.com/v2/checkout";

  const payload = {
    amount,
    currency: "USD",
    returnUrl,
    description,
  };

  try {
    const response: AxiosResponse = await axios.post(apiUrl, payload, {
      auth: {
        username: apiKey,
        password: apiSecret,
      },
    });

    return response.data.url;
  } catch (error) {
    throw new Error("Error generating Payoneer checkout link: " + error);
  }
}
