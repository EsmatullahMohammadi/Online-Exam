/* eslint-disable react/prop-types */

const Button = ({ variant = "dark", children, className }) => {
	return (
		<button
			className={`${className} w-fit px-10 h-[70px] border-l-[6px] border-gray-900 font-oswald font-medium uppercase tracking-wider hover:bg-gray-700 hover:text-white ${
				variant === "light" ? "bg-white text-gray-700" : "bg-gray-700 text-white"
			}`}
		>
			{children}
		</button>
	);
};

export default Button;
