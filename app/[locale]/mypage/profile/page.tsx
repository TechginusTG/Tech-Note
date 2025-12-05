'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/auth-provider';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css'; // 새로운 CSS 모듈 임포트

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, setUser, isLoading } = useAuth();
  const router = useRouter();

  // 기존 상태
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('https://via.placeholder.com/150');
  
  // 새로운 상태 추가
  const [introduction, setIntroduction] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [currentTech, setCurrentTech] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    if (user) {
      setUserName(user.name || user.username || '');
      setProfilePicture(user.image || 'https://via.placeholder.com/150');
      // TODO: 백엔드에서 introduction과 techStack을 추가해야 함
      setIntroduction((user as any).introduction || ''); 
      setTechStack((user as any).techStack || []);
    }
  }, [user]);

  const handleProfileUpdate = async (field: string, value: any) => {
    if (!user) return;

    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setUser({ ...user, ...updatedUser });
      alert('프로필이 성공적으로 업데이트되었습니다!');
      if (field === 'name') {
        setIsEditingName(false);
      }
    } else {
      alert('프로필 업데이트에 실패했습니다.');
    }
  };

  const handleAddTech = () => {
    if (currentTech && !techStack.includes(currentTech)) {
      const newTechStack = [...techStack, currentTech];
      setTechStack(newTechStack);
      setCurrentTech('');
      handleProfileUpdate('techStack', newTechStack); // 즉시 저장
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    const newTechStack = techStack.filter(tech => tech !== techToRemove);
    setTechStack(newTechStack);
    handleProfileUpdate('techStack', newTechStack); // 즉시 저장
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
        // TODO: 이미지 업로드 API 호출 및 user.image 업데이트
        alert('이미지 변경 기능은 준비 중입니다.');
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user && !isLoading) {
    useEffect(() => {
      alert('로그인 후 이용해주세요.');
      router.push('/');
    }, [router]);
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.cardHeader}>프로필 관리</h2>

        {/* 프로필 이미지 섹션 */}
        <div className={`${styles.section} ${styles.profileImageSection}`}>
          <img src={profilePicture} alt="Profile" className={styles.profileImage} />
          <input type="file" id="imageUpload" hidden onChange={handleImageChange} accept="image/*" />
          <button className="btn btn-secondary" onClick={() => document.getElementById('imageUpload')?.click()}>
            이미지 변경
          </button>
        </div>

        {/* 표시 이름 섹션 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>표시 이름</h3>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className={styles.input}
              readOnly={!isEditingName}
            />
            {isEditingName ? (
              <button className="btn btn-primary btn-sm" onClick={() => handleProfileUpdate('name', userName)}>
                저장
              </button>
            ) : (
              <button className="btn btn-secondary btn-sm" onClick={() => setIsEditingName(true)}>
                변경
              </button>
            )}
          </div>
        </div>

        {/* 소개 섹션 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>소개</h3>
          <textarea
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            className={`${styles.input} ${styles.textarea}`}
            placeholder="자신을 소개해보세요."
          />
          <div className="flex justify-end mt-4">
            <button className="btn btn-primary" onClick={() => handleProfileUpdate('introduction', introduction)}>
              소개 저장
            </button>
          </div>
        </div>

        {/* 관심 기술 스택 섹션 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>관심 기술 스택</h3>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={currentTech}
              onChange={(e) => setCurrentTech(e.target.value)}
              className={styles.input}
              placeholder="예: React, Next.js"
            />
            <button className="btn btn-primary btn-sm" onClick={handleAddTech}>
              추가
            </button>
          </div>
          <div className={styles.techStackContainer}>
            {techStack.map(tech => (
              <span key={tech} className={styles.techTag}>
                {tech}
                <button onClick={() => handleRemoveTech(tech)} className="ml-2 text-red-500 hover:text-red-700">x</button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;