
import CardDataStats from '../../../components/CardDataStats';
import ChartOne from '../../../components/Charts/ChartOne';
import ChartThree from '../../../components/Charts/ChartThree';
import ChartTwo from '../../../components/Charts/ChartTwo';
import { FaBook, FaChalkboardTeacher, FaClipboardList, FaFileAlt, FaUserGraduate } from 'react-icons/fa';

const Dashbord = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="All Test" total="$3.456K" rate="0.43%" levelUp>
          <FaClipboardList className="text-primary dark:text-white" size={22}  />
        </CardDataStats>
        <CardDataStats title="All Lecturer" total="$45,2K" rate="4.35%" levelUp>
          <FaChalkboardTeacher className="text-primary dark:text-white" size={22} />
        </CardDataStats>
        <CardDataStats title="All Candidate" total="2.450" rate="2.59%" levelUp>
          <FaUserGraduate className="text-primary dark:text-white" size={22} />
        </CardDataStats>
        <CardDataStats title="Question Bank" total="3.456" rate="0.95%" levelDown>
          <FaBook className="text-primary dark:text-white" size={22} />
        </CardDataStats>
        <CardDataStats title="Candidates Results" total="3.456" rate="0.95%" levelDown>
          <FaFileAlt className="text-primary dark:text-white" size={22} />
        </CardDataStats>
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};

export default Dashbord;
