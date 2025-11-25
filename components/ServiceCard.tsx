import React from 'react';
import Image from 'next/image';

interface ServiceCardProps {
  name: string;
  description: string;
  link: string;
  imageUrl?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ name, description, link, imageUrl }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-full transition-all duration-300 ease-in-out hover:bg-gray-700 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10 flex flex-col">
      <div className="flex-grow">
        <div className="flex items-center mb-2">
          {imageUrl && (
            <div className="mr-4 flex-shrink-0">
              <Image src={imageUrl} alt={`${name} logo`} width={40} height={40} className="rounded-full" />
            </div>
          )}
          <h3 className="text-xl font-bold text-gray-100 transition-colors">{name}</h3>
        </div>
        <p className="text-gray-200 text-sm mb-4 leading-relaxed">{description}</p>
      </div>
      <div className="mt-auto pt-4">
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block text-center w-full bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
        >
          사용해 보기
        </a>
      </div>
    </div>
  );
};

export default ServiceCard;
