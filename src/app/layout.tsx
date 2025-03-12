import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import {ReduxProvider} from '@/store/ReduxProvider';
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {/* <PayPalScriptProvider options={{ "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID??"dshbchd"}}>  */}
            {children}
          {/* </PayPalScriptProvider> */}
        </ReduxProvider>
      </body>
    </html>
  );
}
