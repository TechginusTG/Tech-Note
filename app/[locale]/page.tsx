'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../../lib/hooks/useIntersectionObserver';
import styles from './page.module.css';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { ref: pioneersRef, isVisible: pioneersIsVisible } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: explorersRef, isVisible: explorersIsVisible } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: achieversRef, isVisible: achieversIsVisible } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: companyInfoRef, isVisible: companyInfoIsVisible } = useIntersectionObserver({ threshold: 0.1 });
  const { i18n } = useTranslation();
  const [blogUrl, setBlogUrl] = useState('/ko/blog');

  useEffect(() => {
    if (i18n.language) {
      setBlogUrl(`/${i18n.language}/blog`);
    }
  }, [i18n.language]);

  return (
    <main className="flex flex-col items-center bg-white text-gray-800">
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <video autoPlay loop muted className={styles.backgroundVideo}>
          <source src="/videos/main-video.mp4" type="video/mp4" />
        </video>
        <h1 className="text-5xl font-bold mb-4 text-shadow-lg">Tech-Note</h1>
        <p className="text-xl mb-8 text-shadow">기술과 일상을 기록하고 공유하는 공간</p>
        <Link href={blogUrl} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          블로그 둘러보기
        </Link>
      </section>

      {/* Pioneers Section */}
      <section
        ref={pioneersRef}
        className={`w-full py-20 px-4 md:px-8 lg:px-16 bg-gray-50 ${styles.animatedSection} ${pioneersIsVisible ? styles.isVisible : ''}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">새로운 시작의 개척자들</h2>
          <p className="text-lg text-gray-600 mb-12">새로운 기술을 탐구하고 혁신적인 솔루션을 만드는 데 열정을 가진 개발자 팀입니다. 우리는 함께 배우고, 성장하며, 더 나은 미래를 만들기 위해 노력합니다.</p>
        </div>
      </section>

      {/* Explorers Section */}
      <section
        ref={explorersRef}
        className={`w-full py-20 px-4 md:px-8 lg:px-16 ${styles.animatedSection} ${explorersIsVisible ? styles.isVisible : ''}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">도전의 역사</h2>
          <p className="text-lg text-gray-600 mb-12">우리가 걸어온 도전과 성취의 길입니다.</p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-8 border border-gray-200 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">제10회 AI SW 해커톤 참여</h3>
              <p>antinomy,기억에 남을 첫 시작</p>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">2022 앱 챌린지 우수상</h3>
              <p>사용자 중심의 디자인과 기능으로 우수상을 받았습니다.</p>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">2021 AI 경진대회 1위</h3>
              <p>독창적인 AI 모델을 개발하여 1위를 차지했습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievers Section */}
      <section
        ref={achieversRef}
        className={`relative z-10 w-full py-20 px-4 md:px-8 lg:px-16 bg-gray-50 shadow-2xl ${styles.animatedSection} ${achieversIsVisible ? styles.isVisible : ''}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Achievers Determined to Push Ahead</h2>
          <p className="text-lg text-gray-600 mb-12">Connecting people, investing in the future, and growing globally.</p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Connecting Real Information</h3>
              <p>From blogs to forums, we connect users with valuable information.</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Into the Global Market</h3>
              <p>Expanding our services to reach users all around the world.</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Investing in Future Technologies</h3>
              <p>Pioneering advancements in AI, Robotics, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section
        ref={companyInfoRef}
        className={`w-full py-20 px-4 md:px-8 lg:px-16 bg-gray-800 text-white ${styles.animatedSection} ${companyInfoIsVisible ? styles.isVisible : ''}`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Company</h2>
            <p>We are a tech company dedicated to creating innovative solutions for a better future.</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold">Founded</h4>
              <p>2025</p>
            </div>
            <div>
              <h4 className="font-bold">Headquarters</h4>
              <p>Seoul, Korea</p>
            </div>
            <div>
              <h4 className="font-bold">Core Business</h4>
              <p>블로그, 커뮤니티, AI활용 서비스</p>
            </div>
            <div>
              <h4 className="font-bold">멤버 수</h4>
              <p>4명</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


