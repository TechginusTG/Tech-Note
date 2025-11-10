# Gemini Assistant Project Notes

This file contains important context and guidelines for the Gemini assistant working on this project.

## Next.js Async Server Component Params

In this project, `params` and `searchParams` passed to `async` Server Components (like Pages) are **Promises**. They must be awaited before their properties can be accessed.

### Correct Implementation Pattern:

```typescript
// app/some-route/[dynamic]/page.tsx

// 1. Type the prop as a Promise
type Props = {
  params: Promise<{ dynamic: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 2. Rename the prop in the function signature (e.g., to paramsPromise)
export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Props) {
  // 3. Await the promise to get the resolved object
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;

  // 4. Now you can safely access the properties
  const dynamicValue = params.dynamic;
  const queryValue = searchParams.someQuery;

  // ... rest of the component
}
```

**Reason:** This avoids errors like `TypeError: Cannot read properties of undefined` or Next.js warnings about unwrapping Promises, which occur when accessing `params.dynamic` directly on the unresolved Promise.
