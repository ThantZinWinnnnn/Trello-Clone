import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Provider from "./Provider";
import ProtectedRoute from "@/components/protectedRoute/ProtectedRoute";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Trello Clone",
  description: "Trello Clone Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider>
        <body className={poppins.className} style={{ overflow: "hidden" }}>
          {children}
        </body>
      </Provider>
    </html>
  );
}
