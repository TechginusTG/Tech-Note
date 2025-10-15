import { redirect } from 'next/navigation';

// Server route: redirect plain /blog to the default locale blog at /ko/blog
export default function BlogRedirectPage() {
  // If you want to detect browser language and redirect accordingly,
  // you can add logic here. For now, redirect to Korean default.
  redirect('/en/blog');
}
