import React from 'react';
import '../styles/LegalPage.css';

const TermsPage: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: March 6, 2024</p>
        
        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Recon Project Management System. These Terms of Service ("Terms") govern your access to and use of the Recon Project Management System, including any associated mobile applications, websites, and services (collectively, the "Service"), provided by Recon ("we," "us," or "our").
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.
          </p>
        </section>
        
        <section>
          <h2>2. Account Registration</h2>
          <p>
            To use certain features of the Service, you must register for an account. When you register, you agree to provide accurate, current, and complete information about yourself and to update this information to maintain its accuracy.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>
        
        <section>
          <h2>3. User Responsibilities</h2>
          <p>
            You are responsible for all content that you upload, post, or otherwise transmit via the Service. You agree not to use the Service for any purpose that is unlawful or prohibited by these Terms.
          </p>
          <p>
            You agree not to:
          </p>
          <ul>
            <li>Use the Service in any manner that could damage, disable, overburden, or impair the Service</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Use any robot, spider, or other automated device to access the Service</li>
            <li>Upload or transmit any viruses, malware, or other harmful code</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </section>
        
        <section>
          <h2>4. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by Recon and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          <p>
            You retain ownership of any content that you upload to the Service. By uploading content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content in connection with providing the Service.
          </p>
        </section>
        
        <section>
          <h2>5. Privacy</h2>
          <p>
            Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices regarding your personal information.
          </p>
        </section>
        
        <section>
          <h2>6. Subscription and Billing</h2>
          <p>
            Some features of the Service may require a subscription. By subscribing to the Service, you agree to pay all fees associated with your subscription plan. All fees are non-refundable unless otherwise specified.
          </p>
          <p>
            We may change subscription fees at any time, but will provide you with advance notice before any changes take effect. If you do not agree to the fee changes, you may cancel your subscription before the changes take effect.
          </p>
        </section>
        
        <section>
          <h2>7. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>
        </section>
        
        <section>
          <h2>8. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE OR THE SERVERS THAT MAKE IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
          </p>
        </section>
        
        <section>
          <h2>9. Limitation of Liability</h2>
          <p>
            IN NO EVENT SHALL RECON, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR THE SERVICE, WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE.
          </p>
          <p>
            OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING THE SERVICE DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE DATE OF THE CLAIM.
          </p>
        </section>
        
        <section>
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms on the Service and updating the "Last Updated" date at the top of these Terms.
          </p>
          <p>
            Your continued use of the Service after any changes to these Terms constitutes your acceptance of the revised Terms.
          </p>
        </section>
        
        <section>
          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Recon is established, without regard to its conflict of law provisions.
          </p>
        </section>
        
        <section>
          <h2>12. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            Email: support@recon-project.com<br />
            Phone: (555) 123-4567<br />
            Address: 123 Main Street, Suite 456, Anytown, CA 12345
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage; 