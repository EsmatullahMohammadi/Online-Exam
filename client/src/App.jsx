
function App() {
  const features = [
    {
      title: "Fast and Reliable",
      description: "Experience blazing-fast performance with our tools.",
      icon: "🚀",
    },
    {
      title: "Secure and Private",
      description: "Your data is always safe with our advanced security.",
      icon: "🔒",
    },
    {
      title: "Easy to Use",
      description: "Get started quickly with our intuitive interface.",
      icon: "✨",
    },
  ];
  return (
    <>
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">BrandName</div>
          <div className="space-x-4">
            <a href="#features" className="hover:text-gray-300">
              Features
            </a>
            <a href="#about" className="hover:text-gray-300">
              About
            </a>
            <a href="/auth/signin" className="hover:text-gray-300">
              Contact
            </a>
          </div>
        </div>
      </nav>
      <div className="bg-gray-900 text-white h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-5xl font-bold mb-6">
            Welcome to <span className="text-blue-500">BrandName</span>
          </h1>
          <p className="text-lg mb-8">
            Build your dreams with our state-of-the-art platform. Experience the
            future today.
          </p>
          <div className="space-x-4">
            <a
              href="#features"
              className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
            >
              Get Started
            </a>
            <a
              href="#about"
              className="bg-gray-700 py-3 px-6 rounded-lg hover:bg-gray-600"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
      <div id="features" className="bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Our Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 BrandName. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#facebook" className="hover:text-gray-400">
              Facebook
            </a>
            <a href="#twitter" className="hover:text-gray-400">
              Twitter
            </a>
            <a href="#linkedin" className="hover:text-gray-400">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
