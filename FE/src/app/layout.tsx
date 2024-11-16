"use client";

import { Inter } from "next/font/google";
import ReactQueryProvider from "./utils/providers/ReactQueryProvider";
import "./globals.css";
import store, { persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { CssBaseline } from "@mui/material";
import TopBar from "./components/Topbar";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Toaster position="top-right" duration={2000} />
            <ReactQueryProvider>
              <CssBaseline enableColorScheme />
              <TopBar />
              <main>{children}</main>
            </ReactQueryProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
