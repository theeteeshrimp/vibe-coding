import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-5 glow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create your <span className="gradient-text">workspace</span></h1>
          <p className="text-[var(--text-secondary)] mt-2">Start building with AI in seconds</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-xl)] p-8 shadow-xl shadow-black/20">
          <form action={async (formData) => { "use server";
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const name = formData.get("name") as string;
            const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }) });
            if (res.ok) { const { signIn: doSignIn } = await import("@/lib/auth"); await doSignIn("credentials", { email, password, redirectTo: "/" }); }
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 ml-1">Name</label>
                <input name="name" type="text" placeholder="Your name (optional)" className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)]/40 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 ml-1">Email</label>
                <input name="email" type="email" placeholder="you@example.com" required className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)]/40 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 ml-1">Password</label>
                <input name="password" type="password" placeholder="Min 6 characters" required minLength={6} className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)]/40 transition-all" />
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-medium rounded-[var(--radius-md)] transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 text-sm">Create Account</button>
            </div>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-[var(--bg-secondary)] px-3 text-[var(--text-tertiary)]">or continue with</span></div>
          </div>
          <form action={async () => { "use server"; const { signIn } = await import("@/lib/auth"); await signIn("google", { redirectTo: "/" }); }}>
            <button type="submit" className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius-md)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-[var(--text-tertiary)] mt-6">Already have an account? <Link href="/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium">Sign in</Link></p>
      </div>
    </div>
  );
}
