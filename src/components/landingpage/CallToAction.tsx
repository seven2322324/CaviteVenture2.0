import Image from "next/image";
import Link from 'next/link';

// Cloudinary base URL for the "images" folder
const CLOUDINARY_URL = "https://res.cloudinary.com/ddobzzim4/image/upload/images/";

// Cloudinary images
const starImageURL = `${CLOUDINARY_URL}star.png`;
const springImageURL = `${CLOUDINARY_URL}spring.png`;
const rightArrowImageURL = `${CLOUDINARY_URL}arrow-right.svg`;

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-b from-white to-[#cbbd93] py-24 overflow-x-clip">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16">
        <div className="section-heading relative text-center">
          <h2 className="section-title text-2xl sm:text-3xl lg:text-5xl font-bold">
            Sign up for free today
          </h2>
          <p className="section-description mt-5 text-lg sm:text-xl lg:text-2xl">
            Enjoy exploring and discovering Cavite venture in your own hands
          </p>

          {/* Cloudinary Images */}
          <div className="hidden lg:block">
            <Image
              src={starImageURL}
              alt="star image"
              width={360}
              height={360}
              className="absolute -left-[350px] -top-[137px]"
            />
            <Image
              src={springImageURL}
              alt="spring image"
              width={360}
              height={360}
              className="absolute -right-[331px] -top-[19px]"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-10 justify-center flex-wrap">
          <Link href="/signup">
            <button className="btn btn-primary text-lg sm:text-xl lg:text-2xl px-6 py-3">
              Explore for free
            </button>
            <button className="btn btn-text text-lg sm:text-xl lg:text-2xl px-6 py-3 flex items-center gap-2">
              <span>Learn more</span>
              <Image
                src={rightArrowImageURL}
                alt="right arrow"
                height={20}
                width={20}
                className="h-5 w-5"
              />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
