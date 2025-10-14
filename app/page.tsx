import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center bg-white text-gray-800">
      {/* Hero Section */}
      <section className="w-full h-screen bg-cover bg-center flex flex-col justify-center items-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="text-center bg-black bg-opacity-50 p-8 rounded-lg">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Creators of Change</h1>
          <p className="text-lg md:text-2xl">We are on a journey to build a better world with technology.</p>
        </div>
      </section>

      {/* Pioneers Section */}
      <section className="w-full py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Pioneers of New Beginnings</h2>
          <p className="text-lg text-gray-600 mb-12">A history of our challenges and innovations.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2010</div>
              <p className="mt-2">Founded</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2012</div>
              <p className="mt-2">First Service Launch</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2015</div>
              <p className="mt-2">Global Expansion</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2020</div>
              <p className="mt-2">Reached 1M Users</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2024</div>
              <p className="mt-2">AI Integration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Explorers Section */}
      <section className="w-full py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Explorers Who Always Find a Way</h2>
          <p className="text-lg text-gray-600 mb-12">Our core service areas driving innovation.</p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-8 border border-gray-200 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">SEARCH</h3>
              <p>Delivering the most relevant and comprehensive search results.</p>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">COMMERCE</h3>
              <p>Providing a seamless and enjoyable shopping experience for everyone.</p>
            </div>
            <div className="p-8 border border-gray-200 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">FINTECH</h3>
              <p>Innovating financial services to be more accessible and secure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievers Section */}
      <section className="w-full py-20 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Achievers Determined to Push Ahead</h2>
          <p className="text-lg text-gray-600 mb-12">Connecting people, investing in the future, and growing globally.</p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Connecting Real Information</h3>
              <p>From blogs to forums, we connect users with valuable information.</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Into the Global Market</h3>
              <p>Expanding our services to reach users all around the world.</p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Investing in Future Technologies</h3>
              <p>Pioneering advancements in AI, Robotics, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="w-full py-20 px-4 md:px-8 lg:px-16 bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Company</h2>
            <p>We are a tech company dedicated to creating innovative solutions for a better future.</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold">Founded</h4>
              <p>2010</p>
            </div>
            <div>
              <h4 className="font-bold">Headquarters</h4>
              <p>Seoul, Korea</p>
            </div>
            <div>
              <h4 className="font-bold">Core Business</h4>
              <p>Search, Commerce, Fintech</p>
            </div>
            <div>
              <h4 className="font-bold">Employees</h4>
              <p>5,000+</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}