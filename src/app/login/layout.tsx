import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Login - FixMyRoad",
  description: "Login to your FixMyRoad account",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
} 