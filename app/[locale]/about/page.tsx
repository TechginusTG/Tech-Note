'use client';
import { useTranslation } from 'react-i18next';
import ServiceCard from '@/components/ServiceCard';

const AboutPage = () => {
  const { t } = useTranslation('common');

  const services = [
    {
      title: t('service1_title'),
      description: t('service1_description'),
      link: '#',
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
          <ServiceCard key={index} title={service.title} description={service.description} link={service.link} />
        ))}
      </div>

      <h2 className="text-3xl font-bold text-center mb-8">{t('community_title')}</h2>
      <p className="text-lg text-center mb-8">
        {t('community_description')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Example forum/discussion posts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-2">Forum Post 1</h2>
          <p className="text-gray-700">This is a sample discussion topic. Members can share their thoughts and ideas here.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-2">Forum Post 2</h2>
          <p className="text-gray-700">Another interesting topic for our community to engage with.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-2">Forum Post 3</h2>
          <p className="text-gray-700">A third topic to foster collaboration and knowledge sharing.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;