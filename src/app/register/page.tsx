import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">V</div>
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-gray-400 mt-1">Start building with AI</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-4">
          <form action={async (formData) => { "use server";
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const name = formData.get("name") as string;
            const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/register`, {
              method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }),
            });
            if (res.ok) { const { signIn: doSignIn } = await import("@/lib/auth"); await doSignIn("credentials", { email, password, redirectTo: "/" }); }
          }}>
            <div className="space-y-3">
              <input name="name" type="text" placeholder="Name (optional)" className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              <input name="email" type="email" placeholder="Email" required className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              <input name="password" type="password" placeholder="Password (min 6 characters)" required minLength={6} className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              <button type="submit" className="w-full inline-flex items-center justify-center font-medium rounded-lg transition-all bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-sm">Create Account</button>
            </div>
          </form>
          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div><div className="relative flex justify-center text-xs"><span className="bg-[var(--bg-secondary)] px-2 text-gray-500">or</span></div></div>
          <form action={async () => { "use server"; const { signIn } = await import("@/lib/auth"); await signIn("google", { redirectTo: "/" }); }}>
            <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-sm text-gray-200 hover:bg-[var(--border)] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link></p>
      </div>
    </div>
  );
}
