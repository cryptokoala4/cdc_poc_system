import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ApolloWrapper } from '../components/ApolloWrapper';
import Header from '../components/Header';
// import Footer from '../components/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Restaurant POS",
  description: "Restaurant Point of Sale System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white flex flex-col min-h-screen`}>
        <ApolloWrapper>
          <Header />
          <main className="flex-grow p-4">
            {children}
          </main>
          {/* <Footer /> */}
        </ApolloWrapper>
      </body>
    </html>
  );
}