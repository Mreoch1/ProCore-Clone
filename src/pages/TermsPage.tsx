import React from 'react';
import '../styles/LegalPage.css';

const TermsPage: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: March 6, 2024</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Recon Project Management Systems ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            Recon Project Management Systems is a construction project management platform that provides tools for project planning, task management, document sharing, team collaboration, and budget tracking.
          </p>
        </section>

        <section>
          <h2>3. User Accounts</h2>
          <p>
            To use the Service, you must:
          </p>
          <ul>
            <li>Create an account with accurate information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Promptly notify us of any unauthorized access</li>
            <li>Be at least 18 years old</li>
          </ul>
        </section>

        <section>
          <h2>4. User Responsibilities</h2>
          <p>
            You agree to:
          </p>
          <ul>
            <li>Use the Service in compliance with all applicable laws</li>
            <li>Respect intellectual property rights</li>
            <li>Maintain appropriate security measures</li>
            <li>Not misuse or attempt to disrupt the Service</li>
          </ul>
        </section>

        <section>
          <h2>5. Data and Privacy</h2>
          <p>
            Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the collection and use of information as detailed in our Privacy Policy.
          </p>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by Recon Project Management Systems and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section>
          <h2>7. Subscription and Payments</h2>
          <p>
            Some aspects of the Service may require a paid subscription. Payment terms will be specified during the subscription process. All payments are non-refundable unless otherwise required by law.
          </p>
        </section>

        <section>
          <h2>8. Termination</h2>
          <p>
            We reserve the right to terminate or suspend access to the Service immediately, without prior notice, for any violation of these Terms or for any other reason we deem appropriate.
          </p>
        </section>

        <section>
          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Recon Project Management Systems shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
          </p>
        </section>

        <section>
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Service.
          </p>
        </section>

        <section>
          <h2>11. Contact Information</h2>
          <p>
            For questions about these Terms, please contact us at:
            <br />
            Email: support@reconprojects.com
            <br />
            Phone: (555) 123-4567
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage; 