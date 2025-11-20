'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import ServiceCard from '@/components/ServiceCard';

// Define the type for a single service
interface Service {
  name: string;
  description: string;
  link: string;
  imageUrl?: string;
}

// Define the props for the ServicesList component
interface ServicesListProps {
  services: Service[];
}

const ServicesList: React.FC<ServicesListProps> = ({ services }) => {
    const { t } = useTranslation('common');

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-white mb-8">
                {t('service_list_title')}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <ServiceCard
                        key={service.name}
                        name={service.name}
                        description={service.description}
                        link={service.link}
                        imageUrl={service.imageUrl}
                    />
                ))}
            </div>
        </div>
    );
};

export default ServicesList;
