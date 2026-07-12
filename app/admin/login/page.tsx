import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7F3] px-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
