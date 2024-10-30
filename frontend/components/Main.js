"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ServiceCard = ({ title, imageUrl, onClick }) => (
  <div
    onClick={onClick}
    className="relative aspect-square rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden group"
  >
    {imageUrl ? (
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-600" />
    )}
    <div className="absolute inset-0 bg-black/50 hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
      <p className="text-white text-2xl font-semibold">{title}</p>
    </div>
  </div>
);

export default function Main() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const slides = [
    { id: 1, image: "/slide1.jpg" },
    { id: 2, image: "/slide2.jpg" },
    { id: 3, image: "/slide3.jpg" },
  ];

  const services = [
    { id: 1, title: "ترمیم", url: "/images/tarmim.jpg" },
    { id: 2, title: "لمینت", url: "/images/laminet.jpg" },
    { id: 3, title: "ژل پولیش", url: "/images/zhel.jpg" },
    { id: 4, title: "کاشت", url: "/images/kasht.jpg" },
    { id: 5, title: "مانیکور", url: "/images/manicure.jpg" },
    { id: 6, title: "پدیکور", url: "/images/pedicure.png" },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleServiceClick = (title) => {
    if (mounted) {
      const params = new URLSearchParams(searchParams);
      params.set("title", title);
      router.push(`/appointment?${params.toString()}`);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Logo name</title>
        <meta name="description" content="Your service description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md w-full">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Padide Nail</h1>
          <button className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
            رزرو نوبت
          </button>
        </div>
      </header>

      {/* Hero Slider Section */}
      {/* <div className="relative h-[500px] md:h-[400px] sm:h-[300px] mt-16 w-full">
        <div className="absolute inset-0">
          <Image
            src={slides[currentSlide].image}
            alt={`Slide ${currentSlide + 1}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentSlide === index ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div> */}

      {/* Services Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-[2000px] mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            خدمات
          </h2>
          <p className="text-center mb-12 text-gray-600 font-semibold">
            جهت رزرو نوبت یکی از خدمات را انتخاب کنید
          </p>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                imageUrl={service.url}
                onClick={() => handleServiceClick(service.title)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 py-8 mt-16 w-full">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="text-center md:text-left">
            <h3 className="font-bold mb-2">address</h3>
            <p className="text-gray-600">Your address here</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-bold mb-2">phone number</h3>
            <p className="text-gray-600">Your phone number here</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
