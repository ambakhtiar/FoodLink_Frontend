export function ProfileSkeleton() {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-pulse">
            <div className="h-48 w-full bg-muted rounded-[2.5rem]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-4">
                    <div className="h-64 w-full bg-muted rounded-[2rem]" />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <div className="h-96 w-full bg-muted rounded-[2rem]" />
                </div>
            </div>
        </div>
    );
}
