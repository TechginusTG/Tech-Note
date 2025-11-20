'use client';
import { useTranslation } from 'react-i18next';
import ServiceCard from '@/components/ServiceCard';
import { FaInstagram, FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { useIntersectionObserver } from '../../../lib/hooks/useIntersectionObserver';
import styles from './page.module.css';

const AboutPage = () => {
  const { t } = useTranslation('common');
  const { ref: founderRef, isVisible: founderIsVisible } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: servicesRef, isVisible: servicesIsVisible } = useIntersectionObserver({ threshold: 0.1 });
  const { ref: snsRef, isVisible: snsIsVisible } = useIntersectionObserver({ threshold: 0.1 });

  const services = [
    {
      title: 'Antinomy',
      description: t('service1_description'),
      link: 'https://syncro.tg-antinomy.kro.kr/', // Placeholder link
      imageUrl: '/antinomy.jpg',
    },
    {
      title: 'Astral',
      description: t('service2_description'),
      link: '#',
    },
    {
      title: t('service3_title'),
      description: t('service3_description'),
      link: '#',
    },
  ];

  return (
    <div className={`container mx-auto px-4 py-8 ${styles.aboutContainer}`}>
      <h1 className="text-4xl font-bold mb-4 text-center">TeamTechGinus</h1>
      <p className="text-lg mb-12 text-center">
        {t('about_us_description')}
      </p>

      <div ref={founderRef} className={`${styles.animatedSection} ${founderIsVisible ? styles.isVisible : ''}`}>
        <h2 className={`text-3xl font-bold text-center mb-8 ${styles.sectionTitle}`}>{t('founder_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className={`flex flex-col items-center text-center ${styles.founderCard}`}>
            <img src="https://avatars.githubusercontent.com/u/58172848?v=4" alt="Founder 1" className="w-40 h-40 rounded-full mb-4" />
            <h3 className="text-2xl font-bold">naya1228</h3>
            <p className="text-lg text-gray-600">{t('founder_bio')}</p>
          </div>
          <div className={`flex flex-col items-center text-center ${styles.founderCard}`}>
            <img src="https://avatars.githubusercontent.com/u/140566501?s=400&v=4" alt="Founder 2" className="w-40 h-40 rounded-full mb-4" />
            <h3 className="text-2xl font-bold">system0105</h3>
            <p className="text-lg text-gray-600">{t('founder_bio')}</p>
          </div>
          <div className={`flex flex-col items-center text-center ${styles.founderCard}`}>
            <img src="https://avatars.githubusercontent.com/u/71206378?v=4" alt="Founder 3" className="w-40 h-40 rounded-full mb-4" />
            <h3 className="text-2xl font-bold">GOCACOLA</h3>
            <p className="text-lg text-gray-600">{t('founder_bio')}</p>
          </div>
          <div className={`flex flex-col items-center text-center ${styles.founderCard}`}>
            <img src="https://avatars.githubusercontent.com/u/139461535?v=4" alt="Founder 4" className="w-40 h-40 rounded-full mb-4" />
            <h3 className="text-2xl font-bold">gganwoor</h3>
            <p className="text-lg text-gray-600">{t('founder_bio')}</p>
          </div>
        </div>
      </div>

      <div ref={servicesRef} className={`${styles.animatedSection} ${servicesIsVisible ? styles.isVisible : ''}`}>
        <h2 className={`text-3xl font-bold text-center mb-8 ${styles.sectionTitle}`}>{t('our_services')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <ServiceCard key={index} name={service.title} description={service.description} link={service.link} imageUrl={service.imageUrl} />
          ))}
        </div>
      </div>

      <div ref={snsRef} className={`${styles.animatedSection} ${snsIsVisible ? styles.isVisible : ''}`}>
        <h2 className={`text-3xl font-bold text-center mb-8 ${styles.sectionTitle}`}>{t('sns')}</h2>
        <div className="flex justify-center gap-8">
          <Link href="https://www.instagram.com/team_techginus/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-pink-500">
            <FaInstagram size={48} />
          </Link>
          <Link href="https://github.com/TechginusTG" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
            <FaGithub size={48} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;