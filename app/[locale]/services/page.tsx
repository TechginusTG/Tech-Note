import React from 'react';
import I18nProvider from '@/app/i18n-provider';
import { getStaticParams } from '@/app/i18n';
import ServicesList from '@/components/ServicesList';

// Mock data for services
const services = [
  {
    name: 'Antinomy',
    description: 'A general-purpose service for various applications. High performance and reliability.',
    link: '#',
    imageUrl: 'https://via.placeholder.com/40',
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
