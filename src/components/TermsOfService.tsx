import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using this website, you accept and agree to be bound by the terms and
          provision of this agreement.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
        <p className="mb-4">
          Permission is granted to temporarily download one copy of the materials (information or
          software) on Ayooba's website for personal, non-commercial transitory viewing only.
        </p>
        <p className="mb-4">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul className="list-disc pl-8 mb-4">
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose;</li>
          <li>attempt to decompile or reverse engineer any software contained on Ayooba's website;</li>
          <li>remove any copyright or other proprietary notations from the materials;</li>
          <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
        <p className="mb-4">
          The materials on Ayooba's website are provided on an 'as is' basis. Ayooba makes no
          warranties, expressed or implied, and hereby disclaims and negates all other warranties
          including, without limitation, implied warranties or conditions of merchantability, fitness
          for a particular purpose, or non-infringement of intellectual property or other violation
          of rights.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
        <p className="mb-4">
          In no event shall Ayooba or its suppliers be liable for any damages (including, without
          limitation, damages for loss of data or profit, or due to business interruption) arising
          out of the use or inability to use the materials on Ayooba's website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Revisions and Errata</h2>
        <p className="mb-4">
          The materials appearing on Ayooba's website could include technical, typographical, or
          photographic errors. Ayooba does not warrant that any of the materials on its website are
          accurate, complete, or current. Ayooba may make changes to the materials contained on its
          website at any time without notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
        <p className="mb-4">
          Ayooba has not reviewed all of the sites linked to its website and is not responsible for
          the contents of any such linked site. The inclusion of any link does not imply
          endorsement by Ayooba of the site. Use of any such linked website is at the user's own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
        <p className="mb-4">
          These terms and conditions are governed by and construed in accordance with the laws and
          you irrevocably submit to the exclusive jurisdiction of the courts in that location.
        </p>
      </section>

      <p className="text-sm text-gray-600 mt-8">
        Last updated: October 25, 2025
      </p>
    </div>
  );
};

export default TermsOfService;