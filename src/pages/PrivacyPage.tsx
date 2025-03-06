import React from 'react';
import '../styles/LegalPage.css';

const PrivacyPage: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: March 6, 2024</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Recon Project Management Systems ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <h3>2.1 Personal Information</h3>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Name and contact information</li>
            <li>Account credentials</li>
            <li>Company information</li>
            <li>Professional role and position</li>
            <li>Payment information</li>
          </ul>

          <h3>2.2 Usage Information</h3>
          <p>We automatically collect certain information about your device and how you interact with our Service, including:</p>
          <ul>
            <li>Log and usage data</li>
            <li>Device information</li>
            <li>Location information</li>
            <li>Cookies and tracking technologies</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information for various purposes, including:</p>
          <ul>
            <li>Providing and maintaining our Service</li>
            <li>Processing your transactions</li>
            <li>Responding to your inquiries</li>
            <li>Sending administrative information</li>
            <li>Improving our Service</li>
            <li>Protecting against fraudulent or illegal activity</li>
          </ul>
        </section>

        <section>
          <h2>4. Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Service providers and business partners</li>
            <li>Other users (with your consent)</li>
            <li>Legal authorities when required by law</li>
            <li>Third parties in connection with a business transaction</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your information. However, no electronic transmission or storage system is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>
            We retain your information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
          </p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
            <li>Request data portability</li>
            <li>Withdraw consent</li>
          </ul>
        </section>

        <section>
          <h2>8. Children's Privacy</h2>
          <p>
            Our Service is not directed to children under 18. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us.
          </p>
        </section>

        <section>
          <h2>9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws.
          </p>
        </section>

        <section>
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            Email: privacy@reconprojects.com
            <br />
            Phone: (555) 123-4567
            <br />
            Address: 123 Business Street, Suite 100, City, State 12345
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage; 