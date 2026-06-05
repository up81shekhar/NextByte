import React from 'react'
import Card from './Courses'
import Courses from './Courses'
import AdBanner from './AdBanner'

const Cards = () => {
  return (
    <>
    <div className="text-center mt-12 mb-8 px-10 bg-[#f7f9fa]">

      <h1 className="text-4xl font-bold text-gray-800 ">Explore Your Courses</h1>
      <p className="text-gray-600 mt-4">Select a course to get started</p>
      <AdBanner />

      {/* course cards */}
      <div className="mt-10 m-2 ">

      <Courses id={3} name={"BCA"} fullName= {"Bachelor of Computer Applications"} icon={"💻"} semesters={6} subjects={36} mcqs={850} link="/course/bca" />
      <Courses id={3} name={"MCA"} fullName= {"Master of Computer Applications"} icon={"💻"} semesters={4} subjects={28} mcqs={900} link="/course/mca" />
     <Courses id={3} name={"BBA"} fullName= {"Bachelor of Business Administration"} icon={"💻"} semesters={4} subjects={28} mcqs={900} link="/course/bba" />
      </div>
      <AdBanner />

     </div>
    </>
  )
}


export default Cards