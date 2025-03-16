import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Sign Up - Road Repair Tracker",
  description: "Create a new account for Road Repair Tracker",
};

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
} 