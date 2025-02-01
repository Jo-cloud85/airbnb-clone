// This layout.tsx is by default a server component

import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import RegisterModal from "./components/modals/RegisterModal";
import LoginModal from "./components/modals/LoginModal";
import RentModal from "./components/modals/RentModal";
import SearchModal from "./components/modals/SearchModal";
import ToasterProvider from "./components/providers/ToasterProvider";
import getCurrentUser from "./actions/getCurrentUser";
import { Suspense } from "react";
import Loader from "./components/Loader";

const font = Nunito({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Airbnb v2",
  description: "Airbnb clone app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const currentUser = await getCurrentUser();
  const currentUser = null; 
  return (
    <html lang="en">
      <body className={font.className}>
        <Suspense fallback={<Loader />}>
          <ToasterProvider />
          <SearchModal />
          <RentModal />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser}/>
        </Suspense>
        <div className="pb-20 pt-28">
          {children}
        </div>
      </body>
    </html>
  );
}
