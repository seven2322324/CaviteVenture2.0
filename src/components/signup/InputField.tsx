interface InputFieldProps {
 type: string;
 name: string;
 label: string;
 value: string;
 options?: string[]; // For select inputs
 error: string;
 handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
 required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
 type,
 name,
 label,
 value,
 options = [],
 error,
 handleChange,
 required = false,
}) => {
 return (
   <div className="relative z-0 w-full mb-6 group">
     {type === "select" ? (
       <select
         name={name}
         className="block w-full px-3 py-2 border border-gray-500 bg-beige-100 rounded-md focus:ring-2 focus:ring-brown-500 focus:outline-none focus:border-brown-600 font-serif"
         onChange={handleChange}
         value={value}
         required={required}
       >
         <option value="" disabled>{`Select ${label}`}</option>
         {options.map((option, index) => (
           <option key={index} value={option}>
             {option}
           </option>
         ))}
       </select>
     ) : (
       <input
         type={type}
         name={name}
         placeholder=" "
         className="block w-full px-3 py-2 border border-gray-500 bg-beige-100 rounded-md focus:ring-2 focus:ring-brown-500 focus:outline-none focus:border-brown-600 font-serif"
         onChange={handleChange}
         value={value}
         required={required}
       />
     )}
     <label className="text-sm font-semibold text-brown-700 font-serif">{label}</label>
     {error && <p className="text-red-600 text-xs mt-1 font-serif">{error}</p>}
   </div>
 );
};

export default InputField;
