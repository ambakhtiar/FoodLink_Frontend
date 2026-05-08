import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background p-6">
      {/* Premium Background Mesh */}
      <div className="bg-mesh absolute inset-0" />
      
      {/* Animated Glows */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-lg">
        <div className="mb-10 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-2xl shadow-primary/20 mb-4">
                <span className="text-3xl font-black text-white">F</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
                Food<span className="text-primary">Link</span>
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Zero Hunger Movement</p>
        </div>
        {children}
      </div>
    </div>
  );
}

