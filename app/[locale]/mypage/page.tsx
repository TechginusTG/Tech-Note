'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/auth-provider';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const MyPage = () => {
  const { t } = useTranslation();
  const { user, setUser, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setName(user.name);
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
      body: JSON.stringify({ name, profilePicture }),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setUser({ ...user, ...updatedUser });
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile.');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (!user) return;

    const res = await fetch(`/api/users/${user.id}/change-password` , {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.ok) {
      alert('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to change password.');
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <img
              src={profilePicture || 'https://via.placeholder.com/150'}
              alt="Profile Picture"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <div className="mt-4">
              <button 
                onClick={handleProfileUpdate}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-2">
                프로필 수정
              </button>
              <button 
                onClick={() => signOut()} 
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full">
                로그아웃
              </button>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">기본 정보</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                이름
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                이메일
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline"
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
                저장
              </button>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mt-8">
            <h3 className="text-xl font-bold mb-4">비밀번호 변경</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                현재 비밀번호
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                새 비밀번호
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmNewPassword">
                새 비밀번호 확인
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handlePasswordChange}
              >
                비밀번호 변경
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;