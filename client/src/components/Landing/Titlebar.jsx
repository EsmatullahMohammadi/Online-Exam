/* eslint-disable react/prop-types */

const Titlebar = ({ title, className }) => {
	return (
		<div className="flex items-center gap-4">
			<div className="bg-gray-300 w-[50px] h-[1px]" />
			<span className={`${className} uppercase text-gray-700 text-gray font-sans text-xl font-bold tracking-widest`}>
				{title}
			</span>
		</div>
	);
};

export default Titlebar;
