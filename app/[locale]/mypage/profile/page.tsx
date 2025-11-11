'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/auth-provider';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, setUser, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setNickname(user.nickname || '');
      setUsername(user.username || '');
      setProfilePicture(user.image || '');
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    if (!user) return;

    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, nickname, username }),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setUser({ ...user, ...updatedUser });
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile.');
    }
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user && !isLoading) {
    useEffect(() => {
      alert('Please log in to view this page.');
      router.push('/');
    }, [router]);
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">{t('mypage.profile_title', '기본 정보')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Picture */}
                <div className="md:col-span-1 flex justify-center items-start">
                    <img
                        src={profilePicture || 'https://via.placeholder.com/150'}
                        alt="Profile Picture"
                        className="w-32 h-32 object-cover rounded-md" // Square image
                    />
                </div>

                {/* User Info Inputs */}
                <div className="md:col-span-2 space-y-4">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
                            {t('mypage.name', '이름')}
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="nickname">
                            {t('mypage.nickname', '닉네임')}
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            id="nickname"
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Other fields below */}
            <div className="mt-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                    {t('mypage.username', '사용자명')}
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="mt-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                    {t('mypage.email', '이메일')}
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:border-gray-500 dark:text-gray-400"
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                />
            </div>
            <div className="flex items-center justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleProfileUpdate}
              >
                {t('save', '저장')}
              </button>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">{t('mypage.logout_title', '로그아웃')}</h3>
            <button 
                onClick={() => signOut()} 
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full">
                {t('logout', '로그아웃')}
            </button>
        </div>
    </div>
  );
};

export default ProfilePage;
