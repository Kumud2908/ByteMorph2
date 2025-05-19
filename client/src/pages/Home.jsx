import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import WhyUs from '../components/WhyUs';
// import CallToAction from '../components/CallToAction';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-[#eafaf1] to-[#f7fdfc] min-h-screen">
      <Hero />
      <Features />
      <WhyUs />
      
</div>);
}