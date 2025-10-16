import React from 'react';
import I18nProvider from '@/app/i18n-provider';
import { getStaticParams } from '@/app/i18n';
import ServicesList from '@/components/ServicesList';

// Mock data for services
const services = [
  {
    name: 'Antinomy',
    description: '주도적 문제해결을 위한 편리한 가이드',
    link: 'https://syncro.tg-antinomy.kro.kr/app',
    imageUrl: '/antinomy.jpg',
  },
];

export function generateStaticParams() {
  return getStaticParams();
}

const ServicesPage = async ({ params: { locale } }: { params: { locale: string } }) => {

  return (
    <I18nProvider locale={locale} namespaces={["common"]}>
        <ServicesList services={services} />
    </I18nProvider>
  );
};

export default ServicesPage;
