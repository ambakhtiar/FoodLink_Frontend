import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-mesh flex flex-col items-center justify-center p-4 sm:p-6">
            {/* Extra mesh blobs for depth */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[120px]" />
                <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-secondary/8 blur-[120px]" />
            </div>

            <div className="w-full max-w-[420px] space-y-8">
                {/* Brand header */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl scale-125 group-hover:scale-150 transition-transform duration-500" />
                            <div className="relative bg-primary rounded-2xl p-3 shadow-lg shadow-primary/30">
                                <UtensilsCrossed className="h-7 w-7 text-primary-foreground" />
                            </div>
                        </div>
                        <span className="text-3xl font-black tracking-tight text-gradient">
                            FoodLink
                        </span>
                    </Link>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Connecting surplus food with those in need
                        </p>
                    </div>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
