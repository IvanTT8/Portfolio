import type { Metadata } from "next";
import { LoginForm } from "@/components/ui/login-form";
import { Container } from "@/components/ui/section";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <Container className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center pb-20 pt-32">
      <h1 className="font-serif text-5xl tracking-tight">Sign in</h1>
      <p className="mt-2 text-muted">Sign in to change your profile photo.</p>
      <LoginForm />
    </Container>
  );
}
