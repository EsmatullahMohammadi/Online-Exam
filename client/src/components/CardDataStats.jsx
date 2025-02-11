/* eslint-disable react/prop-types */
import { HiArrowDown, HiArrowUp } from "react-icons/hi";
import { Link } from 'react-router-dom';

const CardDataStats = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  routCard,
  children,
}) => {
  return (
    <Link to={`/admin/${routCard}`}>
      <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          { children }
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-title-md0 font-bold text-black dark:text-white">
              { title }
            </h4>
            <span className="text-md font-medium">{ total }</span>
          </div>
          <span
            className={ `flex items-center gap-1 text-sm font-medium ${levelUp ? 'text-meta-3' : ''
              } ${levelDown ? 'text-meta-5' : ''}` }
          >
            { rate }

            { levelUp && (
              <HiArrowUp className="text-meta-3" size={ 20 } />
            ) }
            { levelDown && (
              <HiArrowDown className="text-meta-5" size={ 20 } />
            ) }
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CardDataStats;
