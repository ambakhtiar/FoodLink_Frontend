import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { RecentPostsSection } from "@/components/home/RecentPostsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { AIHighlightSection } from "@/components/home/AIHighlightSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
    return (
        <div className="flex flex-col">
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <RecentPostsSection />
            <HowItWorksSection />
            <AIHighlightSection />
            <TestimonialSection />
            <CTASection />
        </div>
    );
}
