import React from 'react';
import './LegalPage.css';

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p>Last updated: February 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to the Career Assessment Tool. By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section>
          <h2>2. User Responsibilities</h2>
          <p>
            You agree to use the Career Assessment Tool only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the platform. You are responsible for maintaining the confidentiality of your account and password.
          </p>
        </section>

        <section>
          <h2>3. Intellectual Property</h2>
          <p>
            All content on this platform, including text, graphics, logos, and software, is the property of the Career Assessment Tool and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.
          </p>
        </section>

        <section>
          <h2>4. Limitation of Liability</h2>
          <p>
            The Career Assessment Tool is provided "as is" without any warranties, express or implied. We are not liable for any damages arising from your use of the platform, including but not limited to direct, indirect, incidental, or consequential damages.
          </p>
        </section>

        <section>
          <h2>5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Any changes will be posted on this page, and your continued use of the platform constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2>6. Governing Law</h2>
          <p>
            These terms are governed by the laws of Cameroon. Any disputes arising from your use of the platform will be resolved in the courts of Cameroon.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;