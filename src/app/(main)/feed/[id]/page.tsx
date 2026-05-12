import PostDetailsClient from "./PostDetailsClient";

export async function generateMetadata({ params }: { params: { id: string } }) {
    return {
        title: "Post Details - FoodLink",
    };
}

export default function PostDetailsPage() {
    return <PostDetailsClient />;
}
