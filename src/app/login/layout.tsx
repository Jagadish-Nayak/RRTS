import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Login - Road Repair Tracker",
  description: "Login to your Road Repair Tracker account",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
} 