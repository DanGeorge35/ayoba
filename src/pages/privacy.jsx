import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImage from '../assets/privacy.png'; 

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6c63ff] to-[#b621fe] text-white">
      <Navbar />

      {/* Hero Section in bordered box */}
      <section className="flex justify-center items-center py-20 px-4">
        <div className="w-full max-w-7xl border-1 border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm shadow-xl p-10 flex flex-col md:flex-row items-center justify-between">
      {/* Left Text */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl font-bold font-sans border-b-4 border-purple-300 pb-2">PRIVACY POLICY</h2>
    
    <p className="italic text-purple-200 text-lg mb-6">"We value your trust and are committed to safeguarding your privacy every step of the way."</p>

          </div>

          {/* Right Image */}
          <div className="md:w-1/2 flex justify-center">
            <img 
              src={heroImage} 
              alt="Privacy Illustration" 
              className="max-w-sm md:max-w-md rounded-lg "
            />
          </div>
        </div>
      </section>
      <section className="px-6 md:px-20 py-16 text-white font-serif">
  <div className="max-w-5xl mx-auto space-y-8 leading-relaxed text-[20px] mb-8">
    <p><strong>1. Introduction:</strong><br />
    We are deeply committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and share your personal information. It serves to keep you informed and empowered. <br />
    <span className="text-sm italic text-purple-300">Last updated: May 22, 2025</span></p>

    <p><strong>2. Information We Collect:</strong><br />
    <u>Personal Information:</u> Includes your name, email, phone number, address, and payment details—collected through forms, account registrations, and purchases to deliver services and support.<br />
    <u>Non-Personal Information:</u> Includes data like IP address, browser type, and site activity—collected using cookies and analytics tools to enhance user experience.<br />
    <u>Sensitive Information:</u> We do not collect sensitive information. If ever required, it will be handled with care and transparency.</p>

    <p><strong>3. How We Use the Information:</strong></p>
    <ul className="list-disc list-inside ml-4">
      <li>To provide and maintain our services.</li>
      <li>To enhance and personalize user experience.</li>
      <li>To communicate updates, support, and offers.</li>
      <li>For targeted marketing and advertising (if applicable).</li>
      <li>To prevent fraud and protect user data.</li>
      <li>To fulfill legal and compliance obligations.</li>
    </ul>

    <p><strong>4. How We Share Information:</strong><br />
    Your data may be shared with trusted third-party service providers (e.g., payment processors, email platforms). These parties are bound by confidentiality agreements.<br />
    It may also be disclosed in legal matters, mergers, or with your explicit consent. Aggregated, anonymized data may be shared for analytical or research purposes.</p>

    <p><strong>5. Cookies and Tracking Technologies:</strong><br />
    We use cookies to improve website performance and tailor content. You can manage or disable cookies in your browser settings at any time.</p>

    <p><strong>6. Data Security:</strong><br />
    We use encryption, firewalls, and access controls to protect your data. While we strive for perfection, no system is completely immune to risks.</p>

    <p><strong>7. Your Data Rights:</strong></p>
    <ul className="list-disc list-inside ml-4">
      <li>Access your personal information.</li>
      <li>Request correction or deletion of your data.</li>
      <li>Restrict or object to processing of your data.</li>
      <li>Request a copy of your data (data portability).</li>
      <li>Withdraw previously given consent.</li>
    </ul>
    <p>Contact us to exercise any of these rights.</p>

    <p><strong>8. International Data Transfers:</strong><br />
    If your data is transferred outside your country, we ensure it’s protected by legally approved safeguards such as Standard Contractual Clauses.</p>

    <p><strong>9. Changes to This Privacy Policy:</strong><br />
    This policy may be updated periodically. Changes will be reflected on this page, and major changes will be communicated via email or site notice.</p>

    <p><strong>10. Contact Us:</strong><br />
    For any privacy concerns, please reach out to us at <a href="mailto:privacy@yourwebsite.com" className=" underline !text-[#ffb700]">privacy@yourwebsite.com</a>.</p>
  </div>
</section>
      <Footer />
    </div>
  );
};

export default Privacy;
