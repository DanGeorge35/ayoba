import React from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImage from '../assets/term.png'; 

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6c63ff] to-[#b621fe] text-white">
      <Navbar />

      {/* Hero Section in bordered box */}
      <section className="flex justify-center items-center py-20 px-4">
        <div className="w-full max-w-7xl border-1 border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm shadow-xl p-10 flex flex-col md:flex-row items-center justify-between">
      {/* Left Text */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl font-bold font-sans border-b-4 border-purple-300 pb-2">TERMS OF SERVICE</h2>
            <br/>
            <p> Last Updated: May 22, 2025
                <br/></p>
            <p className="text-purple-200 text-lg mt-8 mb-5">
                Please read these  Terms of Service carefully before using our website and services.
                These Terms constitute a legally binding agreement between you and Quizlead.
                By accessing or using our website and services, you agree to be bound by these Terms.
             If you disagree with any part of the Terms, you may not access the website or use our services.</p>
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
    <p><strong>1. Acceptance of Terms</strong><br />
    By accessing and using our website and services, you acknowledge that you have read,
     understood, and agree to be bound by these Terms, as well as our Privacy Policy.
      If you do not agree to these Terms, you must not use our website or services.</p>
    <p><strong>2. Changes to Terms</strong><br />
    We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
     If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our website after those revisions become effective, you agree to be bound by the revised terms.
     If you do not agree to the new terms, please stop using the website and our services.</p>
    <p><strong>3. Access and Use of Services</strong></p>
    <ul className="list-disc list-inside ml-4">
      <li>Account Registration: To access certain features of our website and services, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for any activities or actions under your account.
         You agree to notify us immediately of any unauthorized use of your account.</li>
      <li>Prohibited Uses: You agree not to use the website or services for any unlawful purpose or any purpose prohibited by these Terms.
         This includes, but is not limited to:
         <li>Violating any applicable local, national, or international law or regulation.</li>
          <li>Engaging in any conduct that restricts or inhibits anyone's use or enjoyment of the website
            , or which, as determined by us, may harm us or users of the website.</li>
           <li>Transmitting any material that is defamatory, obscene, indecent, abusive, offensive, harassing,
             violent, hateful, inflammatory, or otherwise objectionable.</li>
            <li>Impersonating or attempting to impersonate Quizlead
                , a company employee, another user, or any other person or entity.</li>
             <li>Introducing any viruses,
                 Trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful.</li>
             <li>Attempting to gain unauthorized access to, interfere with, damage, or disrupt any parts of the website,
                 the server on which the website is stored, or any server, computer, or database connected to the website</li>
         </li>
      <li>To communicate updates, support, and offers.</li>
      <li>For targeted marketing and advertising (if applicable).</li>
      <li>To prevent fraud and protect user data.</li>
      <li>To fulfill legal and compliance obligations.</li>
    </ul>
    <p><strong>4. Products and Services</strong><br/>
    <ul className="list-disc list-inside ml-4">
    <li>Product Descriptions: We strive to be as accurate as possible in the description of products and services available on our website. However, we do not warrant that product
         descriptions or other content of this website are entirely accurate, complete, reliable, current, or error-free.</li>
     <li>Pricing: All prices displayed on our website are in [Your Currency, e.g., Nigerian Naira (NGN)] unless otherwise stated and are subject to change without notice.
         We reserve the right to correct any pricing errors.</li>
      <li>Availability: All products and services are subject to availability.
         We reserve the right to discontinue any product or service at any time.</li>
       <li>Orders: By placing an order through our website, you warrant that you are legally capable of entering into binding contracts.
         We reserve the right to refuse or cancel any order for any reason at our sole discretion.</li></ul>
   </p>

    <p><strong>5. Payment, Refunds, and Cancellations</strong><br />
    <ul className="list-disc list-inside ml-4">
    <li>Payment: All payments for products and services must be made through the payment methods provided on our website. You agree to
         provide valid payment information and authorize us to charge the applicable fees to your chosen payment method.</li>
      <li>Refunds: Our refund policy is as follows: [Clearly state your refund policy, e.g., "All sales are final," "Refunds are processed within 7 business days for defective products
        ," "No refunds for digital products once downloaded." Be very specific!]</li>
        <li>Cancellations: Our cancellation policy is as follows: [Clearly state your cancellation policy, e.g., "Orders can be cancelled within 24 hours of purchase,
            " "Subscription cancellations take effect at the end of the current billing cycle." Be very specific!]</li>
                   </ul></p>
    <p><strong>6. Intellectual Property Rights</strong><br />
    The website and its entire contents, features, and functionality
     (including but not limited to all information, software, text,
      displays, images, video, and audio, and the design, selection, 
      and arrangement thereof), are owned by Quizlead,
       its licensors, or other providers of such material and are protected by Nigerian and international copyright, trademark, patent, trade secret,
     and other intellectual property or proprietary rights laws.
You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website, except as generally and ordinarily permitted
 through the website's functionality.</p>
    <p><strong>7. User Content</strong><br/>
    If our website allows you to post content (e.g., reviews, comments), you are solely 
    responsible for the content you submit. You grant us a non-exclusive, royalty-free,
     perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt,
      publish, translate, create derivative works from, distribute, and display such content 
      throughout the world in any media.
You represent and warrant that you own or control all rights in and to 
the user content you post and have the right to grant the license granted 
above, and that all of your user content does and will comply with these Terms.
</p>
  <p><strong>8. Disclaimer of Warranties</strong><br/>
    QuizLead and its services are provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations or warranties of any kind, express or implied, as to the operation of our Website or the information, content, or services included on our Website. To the fullest extent permissible by applicable law, we disclaim all warranties, express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
</p>

<p><strong>9. Limitation of Liability</strong><br/>
    In no event shall QuizLead, nor its owners, operators, employees, partners, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Website; (ii) any conduct or content of any third party on the Website; (iii) any content obtained from the Website; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
</p>

<p><strong>10. Indemnification</strong><br/>
    You agree to defend, indemnify, and hold harmless QuizLead and its owners, operators, employees, contractors, agents, and affiliates, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Website, by you or any person using your account and password; b) your breach of these Terms, or c) your violation of any rights of another.
</p>

<p><strong>11. Governing Law and Jurisdiction</strong><br/>
    These Terms shall be governed and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions. This choice of law is made because QuizLead is operated from Nigeria.<br/>
    Any dispute arising from or relating to the subject matter of these Terms shall be subject to the exclusive jurisdiction of the courts located in Lagos State, Nigeria.
</p>

<p><strong>12. Entire Agreement</strong><br/>
    These Terms and our Privacy Policy constitute the entire agreement between you and QuizLead regarding the Website and its services, and supersede and replace any prior agreements, oral or otherwise, regarding the Website and its services.
</p>
  </div>
</section>
      <Footer />
    </div>
  );
};

export default Terms;
