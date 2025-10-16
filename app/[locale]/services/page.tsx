import React from 'react';
import I18nProvider from '@/app/i18n-provider';
import { getStaticParams } from '@/app/i18n';
import ServicesList from '@/components/ServicesList';

// Mock data for services
const services = [
  {
    name: 'Tech Note API',
    description: 'A powerful API for managing your tech notes, posts, and user data. Built with performance and scalability in mind.',
    tags: ['API', 'Backend', 'FastAPI'],
    link: '#',
  },
  {
    name: 'Real-time Editor',
    description: 'Collaborate on documents in real-time with a feature-rich editor. Supports markdown, code highlighting, and more.',
    tags: ['Editor', 'Real-time', 'WebSocket'],
    link: '#',
  },
  {
    name: 'Community Forum',
    description: 'A space for developers to connect, ask questions, and share knowledge. Powered by a modern and intuitive interface.',
    tags: ['Community', 'Forum', 'Next.js'],
    link: '#',
  },
  {
    name: 'Cloud Storage Gateway',
    description: 'Seamlessly integrate with various cloud storage providers like S3, Google Cloud Storage, and more.',
    tags: ['Cloud', 'Storage', 'SDK'],
    link: '#',
  },
    {
    name: 'Authentication Service',
    description: 'Secure and easy-to-integrate authentication service supporting OAuth, JWT, and social logins.',
    tags: ['Auth', 'Security', 'OAuth'],
    link: '#',
  },
  {
    name: 'Data Analytics Dashboard',
    description: 'Visualize your application data with a customizable and interactive analytics dashboard.',
    tags: ['Analytics', 'Dashboard', 'D3.js'],
    link: '#',
  },
];

export function generateStaticParams() {
  return getStaticParams();
}

const ServicesPage = ({ params: { locale } }: { params: { locale: string } }) => {

  return (
    <I18nProvider locale={locale} namespaces={["common"]}>
        <ServicesList services={services} />
    </I18nProvider>
  );
};

export default ServicesPage;
