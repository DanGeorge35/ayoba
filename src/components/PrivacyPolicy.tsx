import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          We collect information that you provide directly to us, including:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>Account information when you create an account</li>
          <li>Profile information that you add to your account</li>
          <li>Content and information you share on our platform</li>
          <li>Communications with us</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-8 mb-4">
          <li>Provide, maintain, and improve our services</li>
          <li>Process your transactions</li>
          <li>Send you technical notices and support messages</li>
          <li>Communicate with you about products, services, and events</li>
          <li>Monitor and analyze trends and usage</li>
          <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
          <li>Protect our rights and property</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Information Sharing and Disclosure</h2>
        <p className="mb-4">
          We do not share your personal information with third parties except in the following circumstances:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>With your consent</li>
          <li>To comply with legal obligations</li>
          <li>To protect our rights and property</li>
          <li>In connection with a business transfer or transaction</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
        <p className="mb-4">
          We take reasonable measures to help protect your personal information from loss, theft,
          misuse, unauthorized access, disclosure, alteration, and destruction. However, no security
          system is impenetrable, and we cannot guarantee the security of our systems.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Your Rights and Choices</h2>
        <p className="mb-4">
          You have certain rights regarding your personal information:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>Access your personal information</li>
          <li>Update or correct inaccurate data</li>
          <li>Request deletion of your information</li>
          <li>Opt-out of marketing communications</li>
          <li>Set your browser to refuse cookies</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Children's Privacy</h2>
        <p className="mb-4">
          Our services are not directed to children under 13. We do not knowingly collect personal
          information from children under 13. If you become aware that a child has provided us with
          personal information, please contact us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this privacy policy from time to time. We will notify you of any changes by
          posting the new privacy policy on this page and updating the "Last updated" date.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this privacy policy or our practices, please contact us.
        </p>
      </section>

      <p className="text-sm text-gray-600 mt-8">
        Last updated: October 25, 2025
      </p>
    </div>
  );
};

export default PrivacyPolicy;