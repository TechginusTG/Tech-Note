import { redirect } from 'next/navigation';

export default function MyPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/mypage/profile`);
}
