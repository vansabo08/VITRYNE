import { AuthForm } from "@/components/AuthForm";
export const metadata = { title: "Criar conta", robots: { index: false } };

export default function Registo() {
  return <AuthForm modo="registo" />;
}
