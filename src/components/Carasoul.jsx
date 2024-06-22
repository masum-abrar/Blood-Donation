import React from 'react';
import pic1 from '../assets/pic1.jpg';
import pic2 from '../assets/pic2.jpg';
import { Link } from 'react-router-dom';

export const Carasoul = () => {
  return (
    <div className="relative">
      <div className="carousel w-full relative">
        <div id="slide1" className="carousel-item relative w-full">
          <img src={pic1} className="w-full h-[600px] object-cover opacity-80" alt="Slide 1" />
          <h1 className="absolute text-white font-bold left-[40%] top-[30%] lg:text-4xl lg:left-[34%] lg:top-[30%] animate__bounce">
            Donate Blood & Save Life
          </h1>
          <p className="absolute top-[40%] left-[20%] lg:left-[26%] lg:top-[40%] text-white w-[60%] lg:w-[50%] text-center">
            Discover Your Dream Home with Us - Where Every Door Opens to a New Beginning.
          </p>
          <div className="absolute flex justify-between items-center transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" className="btn btn-circle">❮</a>
            <a href="#slide2" className="btn btn-circle">❯</a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <img src={pic2} className="w-full h-[600px] object-cover" alt="Slide 2" />
          <div className="absolute flex justify-between items-center transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" className="btn btn-circle">❮</a>
            <a href="#slide3" className="btn btn-circle">❯</a>
          </div>
        </div>
       
       
        <Link to="/signup">
          <button className="btn btn-ghost bg-rose-600 absolute px-8 text-white top-[70%] left-[30%] lg:left-[40%] lg:top-[60%] transform -translate-x-1/2 -translate-y-1/2">
            JOIN AS DONOR
          </button>
        </Link>
        <Link to="/search">
          <button className="btn btn-ghost bg-rose-600 absolute px-9 text-white top-[70%] left-[70%] lg:left-[55%] lg:top-[60%] transform -translate-x-1/2 -translate-y-1/2">
            SEARCH DONORS
          </button>
        </Link>
      </div>
    </div>
  );
};
