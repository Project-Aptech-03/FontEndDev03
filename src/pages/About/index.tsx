import React, { useState } from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const teamMembers = [
    {
      name: "Sinh",
      role: "Founder & CEO",
      description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: "/assets/Image/user.png"
    },
    {
      name: "Phúc",
      role: "Founder & CEO", 
      description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: "/assets/Image/user.png"
    },
    {
      name: "Đạt",
      role: "Founder & CEO",
      description: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      image: "/assets/Image/user.png"
    },
    {
      name: "Cường",
      role: "Creative Director",
      description: "Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "/assets/Image/user.png"
    },
    {
      name: "Tín",
      role: "Head of Production",
      description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      image: "/assets/Image/user.png"
    }
  ];

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setCurrentSlide(0); // Reset to first slide on resize
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getMembersPerSlide = () => {
    if (windowWidth <= 480) return 1;
    if (windowWidth <= 768) return 2;
    return 3;
  };

  const membersPerSlide = getMembersPerSlide();
  const totalSlides = Math.ceil(teamMembers.length / membersPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  const getTransformValue = () => {
    const slideWidth = 100 / totalSlides;
    return `translateX(-${currentSlide * slideWidth}%)`;
  };

  return (
    <>

      <section className="headerSection">
        <h1 className="mainTitle">ABOUT MOON</h1>
        <p className="subtitle">
          With the motto “Books are soul mates”, Moon always strives to provide a warm,
          modern reading space and dedicated service, helping each page of the book get closer to the hearts of readers.
        </p>
      </section>


      <section className="timelineSection">
        <div className="timelineGrid">

          <div className="timelineText">
            <h2 className="year">2000</h2>
            <p className="timelineDescription">
              Moon Bookstore was established in 2000 with the mission of bringing knowledge closer to everyone.
              Over a journey of more than 20 years, Moon has become a familiar destination for book lovers.
            </p>
          </div>

          <div className="timelineImage">
            <div className="imagePlaceholder">
              <img src={'/assets/Image/About1.jpg'} alt="About1" />
            </div>
          </div>

          <div className="timelineImage">
            <div className="imagePlaceholder">
              <img src={'/assets/Image/About2.jpg'} alt="About2" />
            </div>
          </div>

          <div className="timelineText">
            <h2 className="year">2020</h2>
            <p className="timelineDescription">
              we are honored to welcome our 10,000th customer a milestone that confirms the trust and companionship of our readers
            </p>
          </div>

          <div className="timelineText">
            <h2 className="year">2025</h2>
            <p className="timelineDescription">
              By 2025, Moon has brought hundreds of thousands of books in many different genres from literature, life skills, education, children to specialized books to readers all over the country.
              Not only stopping at providing books, Moon also accompanies readers in author exchange activities, reading culture discussions and many programs to encourage the spirit of learning.            </p>
          </div>

          <div className="timelineImage">
            <div className="imagePlaceholder">
              <img src={'/assets/Image/About3.jpg'} alt="About3" />
            </div>
          </div>
        </div>
      </section>


      <section className="teamSection">
        <h2 className="teamTitle">OUR TEAM</h2>
        <div className="teamCarousel">
          <div className="teamGrid" style={{ transform: getTransformValue() }}>
            {teamMembers.map((member, index) => (
              <div key={index} className="teamMember">
                <div className="memberImage">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3 className="memberName">{member.name}</h3>
                <p className="memberRole">{member.role}</p>
                <p className="memberDescription">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="teamNavigation">
            <button 
              className="navButton" 
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              ‹
            </button>
            
            <div className="teamDots">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  className={`dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
            
            <button 
              className="navButton" 
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
            >
              ›
            </button>
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
