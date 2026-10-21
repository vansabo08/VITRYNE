import { AuthForm } from "@/components/AuthForm";
export const metadata = { title: "Entrar", robots: { index: false } };

export default function Entrar() {
  return <AuthForm modo="entrar" />;
}
