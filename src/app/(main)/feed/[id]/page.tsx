import PostDetailsClient from "./PostDetailsClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return {
        title: "Post Details - FoodLink",
    };
}

export default function PostDetailsPage() {
    return <PostDetailsClient />;
}
