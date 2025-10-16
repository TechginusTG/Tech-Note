import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ServiceCardProps {
  name: string;
  description: string;
  link: string;
  imageUrl?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ name, description, link, imageUrl }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 h-full transition-all duration-300 ease-in-out hover:bg-gray-700/50 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10 flex flex-col">
      <Link href={link} className="block group flex-grow">
        <div className="flex items-center mb-2">
          {imageUrl && (
            <div className="mr-4 flex-shrink-0">
              <Image src={imageUrl} alt={`${name} logo`} width={40} height={40} className="rounded-full" />
            </div>
          )}
          <h3 className="text-xl font-bold text-gray-100 group-hover:text-sky-400 transition-colors">{name}</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
      </Link>
      <div className="mt-auto pt-4">
        <button className="w-full bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50">
          사용해 보기
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
