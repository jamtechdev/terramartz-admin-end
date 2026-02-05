import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { Providers } from './providers';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            {children}
            {/* Toasts */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
            />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
