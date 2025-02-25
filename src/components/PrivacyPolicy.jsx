import React from 'react';
import './LegalPage.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p>Last updated: February 2025</p>

        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We collect personal information such as your name, email address, age, and location when you register for an account. We also collect data about your usage of the platform, including assessment results and preferences.
          </p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>
            Your information is used to provide personalized career recommendations, improve our services, and communicate with you. We do not sell or share your data with third parties without your consent, except as required by law.
          </p>
        </section>

        <section>
          <h2>3. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>4. Cookies and Tracking</h2>
          <p>
            We use cookies to enhance your experience on our platform. Cookies help us remember your preferences and track usage patterns. You can disable cookies in your browser settings, but this may affect your ability to use certain features.
          </p>
        </section>

        <section>
          <h2>5. Third-Party Links</h2>
          <p>
            Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of these websites. Please review their privacy policies before providing any personal information.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information at any time. You can also opt out of receiving promotional communications from us. To exercise these rights, please contact us at [email address].
          </p>
        </section>

        <section>
          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes will be posted on this page, and your continued use of the platform constitutes acceptance of the updated policy.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;