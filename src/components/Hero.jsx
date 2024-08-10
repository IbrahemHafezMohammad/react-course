import React from "react";
import { Card, Col, Row } from "antd";
import { Office } from "../assets"; // Placeholder for images

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-indigo-700 py-20 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Find Your Dream Job!
            </h1>
            <p className="my-4 text-xl text-white">
              Find the Job That fits your skill set
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            What We Offer
          </h2>
          <p className="text-lg text-gray-600">
            Whether you are a job seeker or an employer, our platform provides
            you with the tools you need to succeed.
          </p>
        </div>

        <Row gutter={[16, 16]}>
          {/* For Employers */}
          <Col xs={24} md={12}>
            <Card
              hoverable
              cover={
                <img
                  alt="For Employers"
                  src={Office} // Replace with your image source
                  className="h-48 w-full object-cover"
                />
              }
            >
              <Card.Meta
                title="For Employers"
                description="Post job listings, manage applications, and find the best candidates that fit your needs. Our platform offers a streamlined process for you to connect with top talent."
              />
            </Card>
          </Col>

          {/* For Job Seekers */}
          <Col xs={24} md={12}>
            <Card
              hoverable
              cover={
                <img
                  alt="For Job Seekers"
                  src={Office} // Replace with your image source
                  className="h-48 w-full object-cover"
                />
              }
            >
              <Card.Meta
                title="For Job Seekers"
                description="Search for jobs, apply with ease, and track your application status. Our platform helps you find the right opportunities that match your skills and career aspirations."
              />
            </Card>
          </Col>
        </Row>
      </section>
    </>
  );
}

export default Home;
