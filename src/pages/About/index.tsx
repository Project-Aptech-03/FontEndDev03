import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <>
      {/* Header Section */}
      <section className="headerSection">
        <h1 className="mainTitle">ABOUT MOON</h1>
        <p className="subtitle">
          Moon's handmade ceramic products have been around since 1650, let's explore our journey
        </p>
      </section>

      {/* Timeline Grid Section */}
      <section className="timelineSection">
        <div className="timelineGrid">
          {/* 1910 - Text */}
          <div className="timelineText">
            <h2 className="year">1910</h2>
            <p className="timelineDescription">
              Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam neque ultrices.
            </p>
          </div>

          {/* 1910 - Image */}
          <div className="timelineImage">
            <div className="imagePlaceholder">
              {/* Placeholder for hands holding ceramic piece */}
            </div>
          </div>

          {/* 1990 - Image */}
          <div className="timelineImage">
            <div className="imagePlaceholder">
              {/* Placeholder for antique ceramic vase */}
            </div>
          </div>

          {/* 1990 - Text */}
          <div className="timelineText">
            <h2 className="year">1990</h2>
            <p className="timelineDescription">
              Maecenas sem eros, rutrum vitae risus eget, vulputate aliquam nisi. dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit
            </p>
          </div>

          {/* 2010 - Text */}
          <div className="timelineText">
            <h2 className="year">2010</h2>
            <p className="timelineDescription">
              Rutrum vitae risus eget, vulputate aliquam nisi ex gravida neque tempus. sit aliquam sit nullam neque ultrices.
            </p>
          </div>

          {/* 2010 - Image */}
          <div className="timelineImage">
            <div className="imagePlaceholder">
              {/* Placeholder for modern ceramic workshop */}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="teamSection">
        <h2 className="teamTitle">OUR TEAM</h2>
        <div className="teamGrid">
          <div className="teamMember">
            <div className="memberImage"></div>
            <h3 className="memberName">John Smith</h3>
            <p className="memberRole">Founder & CEO</p>
            <p className="memberDescription">
              Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="teamMember">
            <div className="memberImage"></div>
            <h3 className="memberName">Sarah Johnson</h3>
            <p className="memberRole">Creative Director</p>
            <p className="memberDescription">
              Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="teamMember">
            <div className="memberImage"></div>
            <h3 className="memberName">Michael Brown</h3>
            <p className="memberRole">Head of Production</p>
            <p className="memberDescription">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="valuesSection">
        <h2 className="valuesTitle">OUR VALUES</h2>
        <div className="valuesGrid">
          <div className="valueCard">
            <div className="valueIcon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              </svg>
            </div>
            <h3 className="valueTitle">Quality</h3>
            <p className="valueDescription">
              We maintain the highest standards of quality in every piece we create.
            </p>
          </div>
          <div className="valueCard">
            <div className="valueIcon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              </svg>
            </div>
            <h3 className="valueTitle">Tradition</h3>
            <p className="valueDescription">
              We honor centuries-old techniques while embracing modern innovation.
            </p>
          </div>
          <div className="valueCard">
            <div className="valueIcon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              </svg>
            </div>
            <h3 className="valueTitle">Sustainability</h3>
            <p className="valueDescription">
              We are committed to environmentally responsible practices.
            </p>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="mapSection">
        <h2 className="mapTitle">OUR LOCATION</h2>
        <div className="mapContainer">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093746!2d144.953735315324!3d-37.817014442093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce776b!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2s!4v1626998200000!5m2!1sen!2s" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy"
            title="Our Location"
          ></iframe>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
