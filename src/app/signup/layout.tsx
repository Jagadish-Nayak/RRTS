import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Sign Up - FixMyRoad",
  description: "Create a new account for FixMyRoad",
};

export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
} 