import bg2 from "../../../public/university.jpg";

const Home = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${bg2})`,
        transition: "background-image 1s ease-in-out",
      }}
      className="w-full flex items-center justify-center relative h-screen bg-cover bg-center"
    >
      {/* Blurred Overlay
      <div className="absolute inset-0 bg-black bg-opacity-30  z-0"></div>

      <div className="flex flex-col lg:items-start items-center px-6 lg:px-0 z-10">
        <div className="text-center">
          <h1 className="text-white font-semibold font-arial lg:text-[100px] text-[30px] lg:leading-[140px] tracking-wide uppercase">
            KPU English Departemnt
          </h1>
          <p className="text-white font-light font-arial text-sm lg:text-xl mt-4 lg:px-32 px-4 py-2 text-center">
            With reliable and trusted security solutions, we prioritize the
            protection of your home, business, and assets. Our experienced and
            dedicated team is available 24/7 to safeguard what matters most to
            you, ensuring peace of mind and security at all times.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to={"/about-us"}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Why Choose Us!
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Home;
