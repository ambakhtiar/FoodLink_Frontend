import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-background relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl" />
            </div>

            <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2 group hover:opacity-80 transition-opacity">
                        <div className="bg-primary/10 p-3 rounded-2xl group-hover:bg-primary/20 transition-colors">
                            <UtensilsCrossed className="w-8 h-8 text-primary" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                            FoodLink
                        </span>
                    </Link>
                </div>

                <LoginForm />
            </div>
        </div>
    );
}
