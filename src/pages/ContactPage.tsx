import React, { useState } from 'react';
import '../styles/ContactPage.css';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ submitted: true, success: false, message: 'Sending your message...' });
    
    try {
      // In a real application, you would send this data to your backend
      // For now, we'll simulate a successful submission after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'There was an error sending your message. Please try again.'
      });
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-info">
          <h1>Contact Us</h1>
          <p>
            Have questions about our project management solution? We're here to help!
            Fill out the form and our team will get back to you as soon as possible.
          </p>
          
          <div className="contact-methods">
            <div className="contact-method">
              <i className="fas fa-envelope"></i>
              <div>
                <h3>Email</h3>
                <p>support@recon-project.com</p>
              </div>
            </div>
            
            <div className="contact-method">
              <i className="fas fa-phone"></i>
              <div>
                <h3>Phone</h3>
                <p>(555) 123-4567</p>
              </div>
            </div>
            
            <div className="contact-method">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h3>Office</h3>
                <p>123 Main Street, Suite 456<br />Anytown, CA 12345</p>
              </div>
            </div>
          </div>
          
          <div className="business-hours">
            <h3>Business Hours</h3>
            <p>Monday - Friday: 9:00 AM - 5:00 PM PST</p>
            <p>Saturday - Sunday: Closed</p>
          </div>
        </div>
        
        <div className="contact-form-container">
          <h2>Send Us a Message</h2>
          
          {formStatus && formStatus.submitted && formStatus.success ? (
            <div className="form-success">
              <i className="fas fa-check-circle"></i>
              <p>{formStatus.message}</p>
              <button 
                className="new-message-btn"
                onClick={() => setFormStatus(null)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="feedback">Product Feedback</option>
                  <option value="partnership">Partnership Opportunity</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={formStatus?.submitted && !formStatus.success}
              >
                {formStatus?.submitted && !formStatus.success ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
              
              {formStatus?.submitted && !formStatus.success && formStatus.message !== 'Sending your message...' && (
                <div className="form-error">
                  <p>{formStatus.message}</p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 