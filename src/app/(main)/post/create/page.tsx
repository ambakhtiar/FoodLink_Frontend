import { CreatePostForm } from "@/components/post/CreatePostForm";

export default function CreatePostPage() {
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <CreatePostForm />
            </div>
        </div>
    );
}
