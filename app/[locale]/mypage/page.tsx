import { redirect } from 'next/navigation';

export default async function MyPage({
  params: paramsPromise,
}: {
  params: Promise<{ locale: string }>;
}) {
  const params = await paramsPromise;
  redirect(`/${params.locale}/mypage/profile`);
}
