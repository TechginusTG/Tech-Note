import Editor from '@/components/editor/Editor';

export default function NewPostPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Create New Post</h1>
      <form>
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-medium mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full p-2 border rounded-md"
            placeholder="Enter post title"
          />
        </div>
        <div className="mb-8">
          <label className="block text-lg font-medium mb-2">Content</label>
          <Editor />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Publish Post
        </button>
      </form>
    </main>
  );
}
