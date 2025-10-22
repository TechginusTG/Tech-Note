'use client';
import { useTranslation } from 'react-i18next';
import ServiceCard from '@/components/ServiceCard';
import { FaInstagram, FaGithub } from 'react-icons/fa';
import Link from 'next/link';

const AboutPage = () => {
  const { t } = useTranslation('common');

  const services = [
    {
      title: 'Antinomy',
      description: t('service1_description'),
      link: 'https://syncro.tg-antinomy.kro.kr/', // Placeholder link
      imageUrl: '/antinomy.jpg',
    },
    {
      title: t('service2_title'),
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{t('about_us')}</h1>
      <p className="text-lg mb-12">
        {t('about_us_description')}
      </p>

      <h2 className="text-3xl font-bold text-center mb-8">{t('our_services')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {services.map((service, index) => (
          <ServiceCard key={index} name={service.title} description={service.description} link={service.link} imageUrl={service.imageUrl} />
        ))}
      </div>

      <div className="text-center my-16 p-8 bg-gray-800 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">{t('community')}</h2>
        <p className="text-lg mb-8">{t('community_description')}</p>
        <Link href="#" className="inline-block bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50">
          {t('community')}
        </Link>
      </div>

      <h2 className="text-3xl font-bold text-center mb-8">{t('sns')}</h2>
      <div className="flex justify-center gap-8">
        <Link href="https://www.instagram.com/team_techginus/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-pink-500">
          <FaInstagram size={48} />
        </Link>
        <Link href="https://github.com/TechginusTG" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
          <FaGithub size={48} />
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;