import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
