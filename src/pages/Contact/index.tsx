import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './ContactPage.css';

const ContactPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="heroSection">
        <div className="heroLeft">
          <div className="heroIcon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" transform="rotate(45 12 12)" />
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" transform="rotate(90 12 12)" />
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" transform="rotate(135 12 12)" />
            </svg>
          </div>
          <p className="heroSubtitle">Get in touch with us</p>
          <h1 className="heroTitle">CONTACT US</h1>
          <p className="heroDescription">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        <div className="heroRight">
          <div className="heroImage">
            <img src={'./src/assets/img/Lang_On_Ao.webp'} alt="Contact Us" />
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contactSection">
        <div className="contactContent">
          {/* Left - Contact Form */}
          <div className="contactForm">
            <h2 className="formTitle">GET IN TOUCH WITH US</h2>
            <p className="formDescription">
              Lorem ipsum dolor sit amet consectetur adipiscing ell mattis sit phasellus mollis sit aliquam sit nullam.
            </p>

            <form className="form">
              <div className="formRow">
                <div className="formField">
                  <label className="fieldLabel">Name</label>
                  <input
                    type="text"
                    defaultValue="Samatha Clarken"
                    className="inputField"
                  />
                </div>
                <div className="formField">
                  <label className="fieldLabel">Email</label>
                  <input
                    type="email"
                    defaultValue="example@youremail.com"
                    className="inputField"
                  />
                </div>
              </div>

              <div className="formRow">
                <div className="formField">
                  <label className="fieldLabel">Phone</label>
                  <input
                    type="tel"
                    defaultValue="(123) 456 - 7890"
                    className="inputField"
                  />
                </div>
                <div className="formField">
                  <label className="fieldLabel">Company</label>
                  <input
                    type="text"
                    defaultValue="Moon"
                    className="inputField"
                  />
                </div>
              </div>

              <div className="formField">
                <label className="fieldLabel">Message</label>
                <textarea
                  defaultValue="Tell us about your project"
                  className="textareaField"
                  rows={5}
                />
              </div>

              <button type="submit" className="submitButton">
                SEND MESSAGE
              </button>
            </form>
          </div>

          {/* Right - Contact Info */}
          <div className="contactInfo">
            <h3 className="infoTitle">CONTACT INFO</h3>

            <div className="infoItem">
              <h4 className="infoLabel">Visit us</h4>
              <p className="infoText">
                St. Patrick Ave., 10233<br />
                USA
              </p>
            </div>

            <div className="infoItem">
              <h4 className="infoLabel">Call us</h4>
              <p className="infoText">
                +1 234 567 890<br />
                +1 234 567 890
              </p>
            </div>

            <div className="infoItem">
              <h4 className="infoLabel">Write us</h4>
              <p className="infoText">
                info@moon.com<br />
                hello@moon.com
              </p>
            </div>

            <div className="socialLinks">
              <h4 className="socialTitle">Follow us</h4>
              <div className="socialIcons">
                <a href="#" className="socialIcon">
                  <FaFacebook />
                </a>
                <a href="#" className="socialIcon">
                  <FaTwitter />
                </a>
                <a href="#" className="socialIcon">
                  <FaInstagram />
                </a>
                <a href="#" className="socialIcon">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
