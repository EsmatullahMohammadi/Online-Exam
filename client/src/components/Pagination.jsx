// eslint-disable-next-line react/prop-types
const Pagination = ({ currentPage, totalPages, setCurrentPage, setItemsPerPage }) => {
  return (
    // totalPages > 1 && (
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Items Per Page Selector */}
        <div className="flex items-center space-x-3 mb-2 md:mb-0">
          <span className="text-black dark:text-white text-lg">Items per page:</span>
          <select
            className="border-b p-1 dark:bg-boxdark dark:text-white focus:outline-none"
            onChange={(e) =>{ 
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            defaultValue={5}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-4">
          {/* Previous Button */}
            <button
              disabled= {false}
              className="text-body font-semibold dark:text-gray-300 hover:underline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </button>

          {/* Current Page and Total Pages */}
          <span className="text-gray-800 dark:text-white">
            {currentPage} of {totalPages}
          </span>

          {/* Next Button */}
            <button
              className="text-body font-semibold dark:text-gray-300 hover:underline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
        </div>
      </div>
    )
  // );
};

export default Pagination;
