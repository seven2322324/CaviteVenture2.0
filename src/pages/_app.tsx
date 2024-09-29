// src/pages/_app.tsx
import '@/app/globals.css'; // Ensure the path is correct
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
