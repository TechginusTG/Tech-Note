import { FC } from 'react';

const AboutPage: FC = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Meet Our Team
        </h1>
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 text-center">
              <div className="inline-block rounded-full bg-gray-200 p-2">
                {/* Placeholder for an image */}
                <div className="w-32 h-32 rounded-full bg-gray-400 mx-auto"></div>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">John Doe</h2>
              <p className="text-indigo-600 font-semibold">Lead Developer</p>
            </div>
            <div className="md:w-2/3">
              <p className="text-lg text-gray-600">
                John is the visionary behind Tech-Note, with over 10 years of experience in web development. He's passionate about creating scalable and user-friendly applications. When not coding, he enjoys hiking and photography.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/3 text-center">
              <div className="inline-block rounded-full bg-gray-200 p-2">
                {/* Placeholder for an image */}
                <div className="w-32 h-32 rounded-full bg-gray-400 mx-auto"></div>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">Jane Smith</h2>
              <p className="text-indigo-600 font-semibold">UI/UX Designer</p>
            </div>
            <div className="md:w-2/3">
              <p className="text-lg text-gray-600">
                Jane is the creative mind who designed the look and feel of Tech-Note. She believes in minimalist design that is both beautiful and functional. In her free time, she loves painting and visiting art museums.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
