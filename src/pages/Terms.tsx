import React from 'react';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function Terms() {
    useSEO({
      title: "Terms of Service | WebPit",
      description: "Terms of Service for WebPit. Completely free tool for personal or commercial use."
    });
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto py-16 px-4 sm:px-6"
        >
            <div className="text-center mb-16">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Terms of Service</h1>
                <p className="text-slate-500 text-lg">The simple rules for using WebPit.</p>
            </div>

            <div className="bg-white p-8 md:p-12 lg:p-16 rounded-[2.5rem] border border-slate-200/50 shadow-sm prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using WebPit (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, please do not use the Service.
                    </p>
                    <p>
                        These Terms apply to all visitors, users, and customers of WebPit, including both the free web tool at <strong>webpit.site</strong> and the paid WebPit Mac App.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
                    <p>
                        WebPit provides two services:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Web Tool (Free)</strong> — A browser-based image converter and compressor. All processing happens locally on your device; no images are uploaded to any server.</li>
                        <li><strong>WebPit Mac App (Paid)</strong> — A downloadable Mac app sold at a one-time purchase price. Refer to Section 6 for details.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Eligibility</h2>
                    <p>
                        By using the Service, you represent and warrant that:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>You are at least 13 years of age (or the age of digital consent in your country)</li>
                        <li>You have the legal capacity to enter into these Terms</li>
                        <li>You are not located in a country subject to a U.S. government embargo</li>
                    </ul>
                    <p>
                        If you are under 13, you may not use the Service. If you are between 13 and 18, you should use the Service only with the involvement of a parent or guardian.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Acceptable Use</h2>
                    <p>You agree not to use the Service to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Upload, process, or distribute illegal, infringing, or harmful content</li>
                        <li>Attempt to reverse engineer, decompile, or tamper with the Service</li>
                        <li>Interfere with or disrupt the operation of the Service</li>
                        <li>Use automated scripts, bots, or scrapers to access the Service</li>
                        <li>Misrepresent your identity or purpose for using the Service</li>
                        <li>Violate any applicable laws or regulations</li>
                    </ul>
                    <p>
                        We reserve the right to suspend or terminate access to the Service for violations of this section.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Intellectual Property</h2>
                    <p>
                        The WebPit name, logo, website design, Mac app, and all related content are the intellectual property of <strong>WebPit</strong>. You may not reproduce, modify, distribute, or create derivative works without prior written consent.
                    </p>
                    <p>
                        The WebPit Mac App is licensed, not sold. The license granted upon purchase is personal, non-transferable, and non-exclusive. You may install and use the app on your own devices for personal or commercial purposes.
                    </p>
                    <p>
                        Images you process using WebPit remain your property. We claim no ownership over your content.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">6. WebPit Mac App — Paid Product</h2>
                    <p>
                        WebPit for Mac is a paid application sold at a one-time purchase price of <strong>$8.99 USD</strong>. Payments are processed securely by <strong>Paddle.com</strong>, our authorized reseller and Merchant of Record.
                    </p>
                    <p>
                        Upon successful payment, you will receive a download link via email. The license grants you a personal, non-transferable right to install and use the application on your own devices.
                    </p>
                    <p>
                        Pricing and availability are subject to change. If you purchase before a price increase, the price you paid is locked in for that transaction.
                    </p>
                    <p>
                        By completing a purchase, you also agree to Paddle's terms and privacy policy.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Refund Policy</h2>
                    <p>
                        We offer a <strong>14-day money-back guarantee</strong> on the WebPit Mac App. If you are not satisfied, you can request a full refund within 14 days of purchase. See our full <a href="/refund" className="text-blue-600 hover:underline">Refund Policy</a> for instructions.
                    </p>
                    <p>
                        The free web tool is not subject to this refund policy as it is provided at no cost.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Privacy</h2>
                    <p>
                        Your use of the Service is subject to our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>, which explains how we collect, use, and protect your information. By using the Service, you consent to the practices described in the Privacy Policy.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Disclaimer of Warranties</h2>
                    <p>
                        The Service is provided <strong>"as is"</strong> and <strong>"as available"</strong> without any warranties, express or implied. To the maximum extent permitted by law, we disclaim all warranties, including but not limited to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>That the Service will meet your specific requirements</li>
                        <li>That the Service will be uninterrupted, timely, secure, or error-free</li>
                        <li>That the results obtained from using the Service will be accurate or reliable</li>
                        <li>That the quality of any products, services, or information obtained through the Service will meet your expectations</li>
                    </ul>
                    <p>
                        The web tool processes images locally on your device. Results depend on the original file provided, your device's capabilities, and browser implementation. We cannot guarantee a specific output file size, quality level, or processing speed.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by law, WebPit and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Your use or inability to use the Service</li>
                        <li>Any data loss, image quality issues, or browser crashes during processing</li>
                        <li>Unauthorized access to or alteration of your data</li>
                        <li>Any conduct or content of any third party on the Service</li>
                    </ul>
                    <p>
                        Since all image processing in the web tool happens locally in your browser, you retain full responsibility for your original files. We recommend keeping backups.
                    </p>
                    <p>
                        Our total liability for any claim arising from these Terms shall not exceed the amount you have paid to us (if any) in the 12 months preceding the claim.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Indemnification</h2>
                    <p>
                        You agree to indemnify and hold harmless WebPit and its operators from any claims, losses, liabilities, damages, expenses, and costs (including legal fees) arising from:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Your use of the Service</li>
                        <li>Your violation of these Terms</li>
                        <li>Your violation of any third-party rights, including intellectual property rights</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Termination</h2>
                    <p>
                        We reserve the right to suspend or terminate your access to the Service at any time, without prior notice or liability, for any reason, including if you breach these Terms.
                    </p>
                    <p>
                        Upon termination, your right to use the Service will immediately cease. Provisions of these Terms that by their nature should survive termination (including intellectual property, disclaimers, and limitations of liability) shall survive.
                    </p>
                    <p>
                        If you have purchased the Mac App, termination of access to the web tool does not affect your license to use the Mac app.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of the <strong>State of California, United States</strong>, without regard to its conflict of law provisions.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Dispute Resolution</h2>
                    <p>
                        Any disputes arising out of or relating to these Terms or the Service shall be resolved through the following process:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li><strong>Informal Resolution</strong> — Contact us first. We will work in good faith to resolve the issue within 30 days.</li>
                        <li><strong>Binding Arbitration</strong> — If the dispute cannot be resolved informally, it shall be settled by binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in San Francisco, California.</li>
                    </ol>
                    <p>
                        You agree that any claim must be brought in your individual capacity, not as a class action or representative proceeding.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">15. Changes to Terms</h2>
                    <p>
                        We may modify these Terms at any time. Changes will be effective immediately upon posting on this page. Your continued use of the Service after any changes constitutes your acceptance of the new Terms.
                    </p>
                    <p>
                        We will make reasonable efforts to notify users of material changes, such as by updating the "Last updated" date or posting a notice on the website.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">16. Severability</h2>
                    <p>
                        If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that the remaining Terms remain in full force and effect.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">17. Contact</h2>
                    <p className="mb-6">
                        If you have any questions about these Terms, please reach out:
                    </p>
                    <a
                        href="mailto:usman.hyder37@outlook.com"
                        className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all"
                    >
                        <Mail className="w-5 h-5" />
                        Contact Us
                    </a>
                </section>

                <p className="text-xs text-slate-400 pt-8 border-t border-slate-100 mt-12">
                    Last updated: June 2, 2026
                </p>
            </div>
        </motion.div>
    );
}
