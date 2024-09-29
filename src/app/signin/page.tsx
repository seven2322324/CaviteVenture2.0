/* eslint-disable @next/next/no-img-element */
"use client";
import { useState} from 'react';
import { useRouter } from 'next/navigation';
// import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import Slider from "react-slick"; // Import react-slick for the swipable carousel

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const cloudinaryBaseUrl = 'https://res.cloudinary.com/ddobzzim4/image/upload/images/';
const imageUrls = [
  `${cloudinaryBaseUrl}image1.png`,
  `${cloudinaryBaseUrl}image2.png`,
  `${cloudinaryBaseUrl}image3.png`
];

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Explicitly define error as string or null
  const [rememberMe, setRememberMe] = useState(false);
  // const [notifications, setNotifications] = useState(true); // Notifications preference
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const router = useRouter();

  // Use effect to check local storage for email (Remember Me) and preferences
  // useEffect(() => {
  //   const savedEmail = localStorage.getItem('rememberMeEmail');
  //   const savedNotifications = localStorage.getItem('userNotifications');

  //   if (savedEmail) {
  //     setEmail(savedEmail);
  //     setRememberMe(true);
  //   }

  //   // if (savedNotifications !== null) {
  //   //   setNotifications(JSON.parse(savedNotifications));
  //   // }
  // }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (rememberMe) {
      localStorage.setItem('rememberMeEmail', email);
    } else {
      localStorage.removeItem('rememberMeEmail');
    }
  
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Save token to localStorage or cookies
        localStorage.setItem('token', data.token);
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.error);
      }
    } catch {
      setError('An unknown error occurred.');
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail || !/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      setForgotPasswordMessage('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch('/api/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      if (response.ok) {
        setForgotPasswordMessage('Password reset link sent to your email.');
      } else {
        throw new Error('Failed to send password reset link.');
      }
    } catch {
      setForgotPasswordMessage('An unknown error occurred.');
    }

    setTimeout(() => setForgotPasswordModal(false), 3000);
  };

  // const handleNotificationToggle = () => {
  //   const newNotifications = !notifications;
  //   setNotifications(newNotifications);
  //   localStorage.setItem('userNotifications', JSON.stringify(newNotifications));
  // };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    appendDots: (dots: React.ReactNode) => (
      <div>
        <ul className="slick-dots">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
    ),
  };

  return (
    <div className="min-h-screen flex relative bg-white">
      {/* Left side with swipable text content and images */}
      <div className="w-1/2 bg-[#fae8b4] text-gray-700 p-8 flex flex-col justify-center relative">
        <div className="max-w-lg mx-auto text-center">
          <Slider {...sliderSettings}>
            <div className="text-center">
              <img src={imageUrls[0]} alt="Image 1" className="w-40 h-40 mx-auto mb-4" />
              <h3 className="text-4xl font-semibold">Experience the modern Era of museum</h3>
              <p className="text-lg">Discover a new kind of museum where history, art, and technology come alive. Explore interactive displays, walk through historical events with augmented reality, and connect with culture like never before. It’s learning turned into an immersive adventure.</p>
            </div>
            <div className="text-center">
              <img src={imageUrls[1]} alt="Image 2" className="w-40 h-40 mx-auto mb-4" />
              <h3 className="text-4xl font-semibold">Learn about the history</h3>
              <p className="text-lg">Dive into the past and uncover the stories that shaped our world. Explore ancient civilizations, pivotal moments, and cultural heritage through engaging exhibits and interactive displays. It’s history brought to life.</p>
            </div>
            <div className="text-center">
              <img src={imageUrls[2]} alt="Image 3" className="w-40 h-40 mx-auto mb-4" />
              <h3 className="text-4xl font-semibold">Stay Updated on events</h3>
              <p className="text-lg">Keep up with the latest happenings, from exhibitions and workshops to special tours and cultural events. Never miss a moment of what’s new and exciting.</p>
            </div>
          </Slider>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-1/2 bg-white p-8 flex flex-col justify-center">
        <motion.div
          className="max-w-sm mx-auto w-full p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Hello Again!</h2>
          <p className="text-center mb-4">Welcome back! Please enter your details.</p>
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Email Input with Floating Label */}
            <div className="relative z-0">
              <input
                type="email"
                id="email"
                className="peer block w-full appearance-none bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 text-sm p-3"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label
                htmlFor="email"
                className="absolute text-gray-500 text-sm duration-300 transform -translate-y-6 scale-75 top-3 left-0 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email
              </label>
              <FaEnvelope className="absolute right-3 top-3 text-gray-400" />
            </div>

            {/* Password Input with Floating Label */}
            <div className="relative z-0">
              <input
                type="password"
                id="password"
                className="peer block w-full appearance-none bg-transparent border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 text-sm p-3"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label
                htmlFor="password"
                className="absolute text-gray-500 text-sm duration-300 transform -translate-y-6 scale-75 top-3 left-0 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
              <FaLock className="absolute right-3 top-3 text-gray-400" />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Remember me and forgot password section */}
            <div className="flex justify-between items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="form-checkbox"
                />
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                className="text-blue-600 text-sm"
                onClick={() => setForgotPasswordModal(true)}
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign in Button */}
            <button
              type="submit"
              className="w-full bg-[#fae8b4] text-gray-700 px-4 py-2 rounded-lg hover:bg-[#f5d892] transition duration-300"
            >
              Login
            </button>

            {/* Google Sign-In */}
            {/* <button
              type="button"
              className="w-full mt-4 border border-gray-300 text-black px-4 py-2 rounded-lg flex justify-center items-center space-x-2 hover:bg-gray-100 transition duration-300"
              onClick={() => signIn('google')}
            >
              <img src={`${cloudinaryBaseUrl}google-icon.svg`} alt="Google" className="w-5 h-5" />
              <span>Sign in with Google</span>
            </button> */}

            {/* Notification Preference Toggle */}
            {/* <div className="mt-4 flex items-center">
              <input
                id="notifications"
                type="checkbox"
                checked={notifications}
                onChange={handleNotificationToggle}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900">
                Receive Email Notifications
              </label>
            </div> */}

            {/* Sign Up Link */}
            <p className="text-center text-sm mt-4">
              Don&apos;t have an account yet? <Link href="/signup" className="text-blue-600">Sign Up</Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Forgot Password</h3>
            <p className="mb-4 text-sm">Enter your email address, and we’ll send you a link to reset your password.</p>
            <input
              type="email"
              className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm p-3 mb-4"
              placeholder="Email address"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              required
            />
            {forgotPasswordMessage && <p className="text-sm text-red-500">{forgotPasswordMessage}</p>}
            <div className="flex justify-between items-center">
              <button
                className="bg-[#fae8b4] text-gray-700 px-4 py-2 rounded-lg hover:bg-[#f5d892] transition duration-300"
                onClick={handleForgotPassword}
              >
                Send Reset Link
              </button>
              <button
                className="text-gray-500"
                onClick={() => setForgotPasswordModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
