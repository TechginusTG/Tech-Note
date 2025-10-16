import React from 'react';
import Link from 'next/link';

interface ServiceCardProps {
  name: string;
  description: string;
  tags: string[];
  link: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ name, description, tags, link }) => {
  return (
    <Link href={link} className="block group h-full">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 h-full transition-all duration-300 ease-in-out hover:bg-gray-700/50 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10 flex flex-col">
        <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-sky-400 transition-colors">{name}</h3>
        <p className="text-gray-400 text-sm mb-4 flex-grow">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
