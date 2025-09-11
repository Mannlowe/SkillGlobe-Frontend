'use client';

import { X } from 'lucide-react';

interface TermsAndConditionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsAndCondition({ isOpen, onClose }: TermsAndConditionProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Terms and Conditions</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 flex-grow">
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">Terms and Conditions</h3>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">PURPOSE:</h3>
              <p className="text-gray-600">
                SkillGlobe.com is intended only to serve as a preliminary medium of contact and exchange of information for its users / members / visitors who have a bona fide intention to contact and/or be contacted for the purposes related to genuine existing job vacancies and for other career enhancement services.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">USE TO BE IN CONFORMITY WITH THE PURPOSE</h3>
              <p className="text-gray-600">
                SkillGlobe.com (and related products) or service or product that is subscribe to or used (whether the same is paid for by you or not) is meant for the Purpose and only the exclusive use of the subscriber/registered user. Copying or downloading or recreating or sharing passwords or sublicensing or sharing in any manner which is not in accordance with these terms, is a misuse of the platform or service or product and Delphi Computech Pvt Ltd reserves its rights to act in such manner as to protect its loss of revenue or reputation or claim damages including stopping your service or access and reporting to relevant authorities. In the event you are found to be copying or misusing or transmitting or crawling any data or photographs or graphics or any information available on SkillGlobe.com for any purpose other than that being a bonafide Purpose, we reserve the right to take such action that we deem fit including stopping access and claiming damages.
              </p>
              <p className="text-gray-600">
                The site is a public site with free access and Delphi Computech Pvt Ltd assumes no liability for the quality and genuineness of responses. Delphi Computech Pvt Ltd. cannot monitor the responses that a person may receive in response to information he/she has displayed on the site. The individual/company would have to conduct its own background checks on the bonafide nature of all response(s).
              </p>
              <p className="text-gray-600">
                You give us permission to use the information about actions that you have taken on SkillGlobe.com in connection with ads, offers and other content (whether sponsored or not) that we display across our services, without any compensation to you. We use data and information about you to make relevant suggestions and recommendation to you and others.
              </p>
              <p className="text-gray-600">
                The platform may contain links to third party websites, these links are provided solely as convenience to You and the presence of these links should not under any circumstances be considered as an endorsement of the contents of the same, if You chose to access these websites you do so at your own risk.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">THE USER REPRESENTS, WARRANTS AND COVENANTS THAT ITS USE OF SKILLGLOBE.COM SHALL NOT BE DONE IN A MANNER SO AS TO:</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Access the Platform for purposes of extracting content to be used for training a machine learning or AI model, without the express prior written permission.</li>
                <li>Violate any applicable local, provincial, state, national or international law, statute, ordinance, rule or regulation;</li>
                <li>Interfere with or disrupt computer networks connected to SkillGlobe.com;</li>
                <li>Impersonate any other person or entity, or make any misrepresentation as to your employment by or affiliation with any other person or entity;</li>
                <li>Forge headers or in any manner manipulate identifiers in order to disguise the origin of any user information;</li>
                <li>Interfere with or disrupt the use of SkillGlobe.com by any other user, nor "stalk", threaten, or in any manner harass another user;</li>
                <li>Use SkillGlobe.com in such a manner as to gain unauthorized entry or access to the computer systems of others;</li>
                <li>Reproduce, copy, modify, sell, store, distribute or otherwise exploit for any commercial purposes SkillGlobe.com, or any component thereof (including, but not limited to any materials or information accessible through SkillGlobe.com);</li>
                <li>Use content from the Site for derivative works with a commercial motive without prior written consent of the Delphi Computech Pvt Ltd.</li>
                <li>Use any device, software or routine to interfere or attempt to interfere with the proper working of SkillGlobe.com; or</li>
                <li>Impose an unreasonable or disproportionately large load on SkillGlobe.com infrastructure.</li>
                <li>Spam SkillGlobe.com/Delphi Computech Pvt Ltd by indiscriminately and repeatedly posting content or forwarding mail that may be considered spam etc.</li>
                <li>Access data not intended for you or log into server or account that you are not authorized to access;</li>
                <li>Constitute an act of reverse engineering, decompiling, disassembling, deciphering or otherwise attempting to derive the source code for the Site or any related technology or any part thereof</li>
                <li>Engage in "framing," "mirroring," or otherwise simulating the appearance or function of the Site</li>
                <li>Attempt to probe, scan or test the vulnerability of a system or network;</li>
                <li>Use automated means to crawl and/or scrape content from SkillGlobe.com and to manually scrape content from SkillGlobe.com;</li>
              </ul>
              <p className="text-gray-600">
                The Site uses technological means to exclude Robots etc. from crawling it and scraping content. You undertake not to circumvent these methods.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Constitute hosting, modifying, uploading, posting, transmitting, publishing, or distributing any material or information</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>For which you do not have all necessary rights and licenses;</li>
                <li>Which infringes, violates, breaches or otherwise contravenes the rights of any third party, including any copyright, trademark, patent, rights of privacy or publicity or any other proprietary right;</li>
                <li>Which contains a computer virus, or other code, files or programs intending in any manner to disrupt or interfere with the functioning of SkillGlobe.com, or that of other computer systems;</li>
                <li>That is grossly harmful, harassing, invasive of another's privacy, hateful, disparaging, relating to money laundering or unlawful, or which may potentially be perceived as being harmful, threatening, abusive, harassing, defamatory, libelous/blasphemous, vulgar, obscene, or racially, ethnically, or otherwise unlawful in any manner whatsoever;</li>
                <li>Which constitutes or encourages conduct that would constitute a criminal offence, give rise to other liability, or otherwise violate applicable law;</li>
                <li>That deceives or misleads the addressee about the origin of such messages or communicates any information which is grossly offensive or menacing in nature;</li>
                <li>That belongs to another person and to which the user does not have any right to;</li>
                <li>That harm minors in any way;</li>
                <li>That threatens the unity, integrity, defence, security or sovereignty of India, friendly relations with foreign states, or public order or causes incitement to the commission of any cognisable offence or prevents investigation of any offence or is insulting any other nation.</li>
              </ul>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Payments and Refunds</h3>
              <p className="text-gray-600">
                Payments for the services offered by SkillGlobe.com shall be on a 100% advance basis. Refund if any will be at the sole discretion of Delphi Computech Pvt Ltd. Delphi Computech Pvt Ltd offers no guarantees whatsoever for the accuracy or timeliness of the refunds reaching the Customers card/bank accounts. Delphi Computech Pvt Ltd gives no guarantees of server uptime or applications working properly. All is on a best effort basis and liability is limited to refund of amount only. Delphi Computech Pvt Ltd undertakes no liability for free services. Delphi Computech Pvt Ltd reserves its right to amend / alter or change all or any disclaimers or terms of agreements at any time without any prior notice. All terms / disclaimers whether specifically mentioned or not shall be deemed to be included if any reference is made to them.
              </p>
            </section>
          </div>
        </div>
        
      </div>
    </div>
  );
}