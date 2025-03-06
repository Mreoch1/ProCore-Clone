import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About Recon</h1>
          <p>Building better project management solutions for construction and engineering teams.</p>
        </div>
      </div>
      
      <div className="about-container">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            At Recon, we're on a mission to transform how construction and engineering teams manage their projects. 
            We believe that with the right tools, teams can reduce delays, minimize cost overruns, and deliver 
            exceptional results for their clients.
          </p>
          <p>
            Our platform combines powerful project management capabilities with intuitive design, making it easy 
            for teams of all sizes to plan, execute, and track their projects from start to finish.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Recon was founded in 2020 by a team of construction professionals and software engineers who were 
            frustrated with the existing project management solutions on the market. They saw an opportunity to 
            create something better—a platform specifically designed for the unique challenges of construction 
            and engineering projects.
          </p>
          <p>
            What started as a simple tool for tracking tasks and deadlines has evolved into a comprehensive 
            project management platform used by thousands of professionals around the world. Today, Recon 
            continues to innovate and expand, driven by our commitment to helping teams build better.
          </p>
        </section>
        
        <section className="about-values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <i className="fas fa-handshake"></i>
              <h3>Collaboration</h3>
              <p>We believe that great things happen when teams work together seamlessly.</p>
            </div>
            
            <div className="value-card">
              <i className="fas fa-lightbulb"></i>
              <h3>Innovation</h3>
              <p>We're constantly exploring new ways to solve complex project management challenges.</p>
            </div>
            
            <div className="value-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Reliability</h3>
              <p>We build software that teams can depend on, day in and day out.</p>
            </div>
            
            <div className="value-card">
              <i className="fas fa-users"></i>
              <h3>Customer Focus</h3>
              <p>Everything we do is guided by the needs and feedback of our users.</p>
            </div>
          </div>
        </section>
        
        <section className="about-team">
          <h2>Our Team</h2>
          <p className="team-intro">
            Recon is powered by a diverse team of professionals with backgrounds in construction, 
            engineering, software development, and design. We're united by our passion for building 
            great software and our commitment to helping our customers succeed.
          </p>
          
          <div className="team-grid">
            <div className="team-member">
              <div className="team-member-photo" style={{ backgroundColor: '#e2e8f0' }}>
                <i className="fas fa-user"></i>
              </div>
              <h3>Sarah Johnson</h3>
              <p className="team-member-title">Co-Founder & CEO</p>
              <p>Former construction project manager with 15+ years of experience.</p>
            </div>
            
            <div className="team-member">
              <div className="team-member-photo" style={{ backgroundColor: '#e2e8f0' }}>
                <i className="fas fa-user"></i>
              </div>
              <h3>Michael Chen</h3>
              <p className="team-member-title">Co-Founder & CTO</p>
              <p>Software engineer with a background in civil engineering.</p>
            </div>
            
            <div className="team-member">
              <div className="team-member-photo" style={{ backgroundColor: '#e2e8f0' }}>
                <i className="fas fa-user"></i>
              </div>
              <h3>David Rodriguez</h3>
              <p className="team-member-title">Head of Product</p>
              <p>Passionate about creating intuitive user experiences.</p>
            </div>
            
            <div className="team-member">
              <div className="team-member-photo" style={{ backgroundColor: '#e2e8f0' }}>
                <i className="fas fa-user"></i>
              </div>
              <h3>Emily Patel</h3>
              <p className="team-member-title">Head of Customer Success</p>
              <p>Dedicated to helping our customers get the most out of Recon.</p>
            </div>
          </div>
        </section>
        
        <section className="about-cta">
          <h2>Join Us on Our Journey</h2>
          <p>
            We're just getting started, and we're excited about the road ahead. Whether you're looking 
            for a better way to manage your projects or you're interested in joining our team, we'd love 
            to hear from you.
          </p>
          <div className="cta-buttons">
            <Link to="/contact" className="cta-button primary">Contact Us</Link>
            <Link to="/careers" className="cta-button secondary">View Careers</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage; 