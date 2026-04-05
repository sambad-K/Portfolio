import type { AppProps } from "next/app";
import { PortfolioProvider } from "../context/PortfolioContext";
import "../styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PortfolioProvider>
      <Component {...pageProps} />
    </PortfolioProvider>
  );
}