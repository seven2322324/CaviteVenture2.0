interface PrivacyModalProps {
 isVisible: boolean;
 onAgree: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isVisible, onAgree }) => {
 if (!isVisible) return null;

 return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
     <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg">
       <h2 className="text-2xl font-bold mb-4">Data Privacy Policy</h2>
       <p className="mb-4">
         Please review and agree to the data privacy policy before proceeding with your sign-up.
       </p>
       <button
         className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
         onClick={onAgree}
       >
         Agree and Continue
       </button>
     </div>
   </div>
 );
};

export default PrivacyModal;
