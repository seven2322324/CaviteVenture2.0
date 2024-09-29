interface ButtonProps {
 label: string;
 onClick?: () => void;
 type?: "button" | "submit";
 color?: "blue" | "red";
}

const Button: React.FC<ButtonProps> = ({ label, onClick, type = "button", color = "blue" }) => {
 const colorClass = color === "blue" ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600";
 
 return (
   <button
     type={type}
     className={`w-full text-white px-4 py-2 rounded-lg transition duration-300 ${colorClass}`}
     onClick={onClick}
   >
     {label}
   </button>
 );
};

export default Button;
