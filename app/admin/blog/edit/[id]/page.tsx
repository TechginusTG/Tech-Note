// This page will be used to edit an existing blog post.
// It would fetch the post data based on the [id] parameter.

import Editor from '@/components/editor/Editor';

type Props = {
  params: { id: string };
};

export default async function EditPostPage({ params }: Props) {
  // const post = await fetchPostById(params.id); // You would implement this function in lib/api.ts

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Edit Post</h1>
      <p className="mb-8">Editing post with ID: {params.id}</p>
      {/* Pre-fill the form with the fetched post data */}
      <form>
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-medium mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full p-2 border rounded-md"
            // defaultValue={post?.title}
          />
        </div>
        <div className="mb-8">
          <label className="block text-lg font-medium mb-2">Content</label>
          {/* The Editor would need to be initialized with the post content */}
          <Editor />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Update Post
        </button>
      </form>
    </main>
  );
}
