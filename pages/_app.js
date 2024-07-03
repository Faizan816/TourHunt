import { Provider } from "react-redux";
import store from "../store";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "../assets/Styles/main.scss";

// Load your Stripe public key
const stripePromise = loadStripe(
  "pk_test_51P6zdjRvIsMBO65P92Btgxgo3vyUEFuYKdPHMhgzXMSxdusObLAWNy7jJdTjPtOtneW0hPsJWRH8qhHTiPkex1fT00Ywnq7ufx"
);

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
          />
          {/* <link
            href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css"
            rel="stylesheet"
          /> */}
        </Head>
        {/* Wrap the entire app inside the Elements provider */}
        <Elements stripe={stripePromise}>
          <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
          </SessionProvider>
        </Elements>
      </ChakraProvider>
    </Provider>
  );
}
