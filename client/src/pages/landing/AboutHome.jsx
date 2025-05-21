import { Link } from "react-router-dom";
import Button from "../../components/Landing/Button";
import Titlebar from "../../components/Landing/Titlebar";

const AboutHome = () => {
  return (
    <div className="w-full flex items-center justify-between bg-[#f9fafb] lg:h-[514px] p-6 lg:p-0 px-4 md:px-14 lg:px-[210px]">
      <div className="container mx-auto">
        <div className="flex lg:flex-row flex-col items-start justify-between w-full gap-4 lg:gap-10">
          <div className="flex flex-col gap-4">
            <Titlebar title="about us" />
            <span className="uppercase font-oswald font-bold text-[45px] leading-[55px] text-gray-800 lg:max-w-[450px]">
              Discover More About KPU
            </span>
          </div>
          <div className="flex flex-col gap-3 lg:max-w-[640px] max-w-full">
            <span className="font-sans font-semibold text-lg text-gray-800">
              Kabul Polytechnic University: Shaping the Future with Knowledge,
              Innovation, and Dedication.
            </span>
            <p className="text-gray-600 font-sans text-lg">
              Kabul Polytechnic University is Afghanistan leading institution
              for engineering and technical education. With decades of academic
              excellence, we are committed to nurturing future leaders,
              fostering innovation, and contributing to national development.
            </p>
            <Link to={"/about-us"}>
              <Button className="!h-[54px] mt-8 shadow-lg" variant="light">
                about us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHome;
