import React from 'react';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function Privacy() {
    useSEO({
      title: "Privacy Policy | WebPit",
      description: "Read about how your photos stay 100% private. All processing—including conversion and compression—happens right in your browser."
    });
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto py-16 px-4 sm:px-6"
        >
            <div className="text-center mb-16">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Privacy Policy</h1>
                <p className="text-slate-500 text-lg">How we protect your images and data.</p>
            </div>

            <div className="bg-white p-8 md:p-12 lg:p-16 rounded-[2.5rem] border border-slate-200/50 shadow-sm prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Privacy is Our Priority</h2>
                    <p>
                        At WebPit, we believe your photos are your business. That's why we built our tool to be 100% private.
                        Unlike other online converters, we do not upload your images to any server. All processing—including conversion and compression—happens right in your browser.
                    </p>
                    <p>
                        This policy explains what information we collect, how we use it, and what rights you have over your data.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
                    <p>
                        We collect very little data, and we never collect or store your images. Here's what we do collect and why:
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Google Analytics</h3>
                    <p>
                        We use Google Analytics (GA4, measurement ID: <strong>G-86TZ4T7C8W</strong>) to understand how the site is used. GA4 collects:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li>Pages you visit and how long you stay</li>
                        <li>Device type, browser, and operating system</li>
                        <li>Approximate geographic location (city-level from IP)</li>
                        <li>Conversion events when you use our tools (e.g., <em>image_converted</em> event with the filename and quality setting)</li>
                        <li>Referrer information (how you found the site)</li>
                    </ul>
                    <p>
                        GA4 sets first-party cookies (<code>_ga</code>, <code>_gid</code>, <code>_gat</code>) to distinguish returning users. The GA4 script loads after a 2-second delay to prioritize the main page content.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Vercel Speed Insights</h3>
                    <p>
                        We use Vercel Speed Insights to monitor site performance. This collects anonymous performance metrics such as Core Web Vitals, page load times, and technical error rates. No images or personal details are included.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Payment Information (Paddle)</h3>
                    <p>
                        When you purchase the WebPit Desktop App, payments are processed by <strong>Paddle.com</strong>, our authorized reseller and Merchant of Record. Paddle collects your name, email address, billing address, and payment card details. We do not receive or store your full payment card information. We only receive your email address and the transaction status from Paddle.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Email Information</h3>
                    <p>
                        If you use the redownload form to request a new download link for the desktop app, we collect the email address you provide to look up your purchase. This information is used only to process your request and is not retained longer than necessary.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Blog (Sanity CMS)</h3>
                    <p>
                        Our blog is powered by Sanity.io. When you visit blog pages, your browser communicates directly with Sanity's CDN to fetch content, which means Sanity may collect standard server logs including your IP address and browser information.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-2">File Delivery (Cloudflare R2)</h3>
                    <p>
                        The desktop app installer is stored in Cloudflare R2. When you download it, Cloudflare receives standard request metadata (IP address, user agent, timestamp) for the purpose of delivering the file.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Local & Session Storage</h3>
                    <p>
                        We use your browser's local storage to track how many images you've processed today (to enforce a daily usage limit) and session storage to temporarily hold a download link after a successful purchase. This data never leaves your browser and is not shared with any server.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
                    <p>We use the information we collect for the following purposes:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>To operate, maintain, and improve the WebPit website and services</li>
                        <li>To process and fulfill desktop app purchases and redownload requests</li>
                        <li>To analyze site usage and performance (via GA4 and Vercel Speed Insights)</li>
                        <li>To detect, prevent, and address technical issues or abuse</li>
                        <li>To communicate with you about your purchase or support requests</li>
                    </ul>
                    <p>
                        We do not sell your personal information to third parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies & Tracking</h2>
                    <p>
                        WebPit uses a minimal number of cookies strictly for analytics purposes. Google Analytics sets the following first-party cookies:
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                        <li><code>_ga</code> — Used to distinguish returning users (expires after 2 years)</li>
                        <li><code>_gid</code> — Used to distinguish users (expires after 24 hours)</li>
                        <li><code>_gat</code> — Used to throttle request rate (expires after 1 minute)</li>
                    </ul>
                    <p>
                        We do not use advertising cookies, tracking pixels, or third-party marketing trackers. You can control cookies through your browser settings or use a browser extension to block Google Analytics tracking across all sites.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Services</h2>
                    <p>The following third-party services are used by WebPit. Each has its own privacy policy governing how they handle your data:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Google Analytics</strong> — Analytics (<a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a>)</li>
                        <li><strong>Vercel</strong> — Hosting &amp; Speed Insights (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a>)</li>
                        <li><strong>Paddle</strong> — Payment processing (<a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a>)</li>
                        <li><strong>Sanity.io</strong> — Blog CMS (<a href="https://www.sanity.io/legal/privacy" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a>)</li>
                        <li><strong>Cloudflare</strong> — File storage &amp; delivery via R2 (<a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a>)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Retention</h2>
                    <p>
                        We retain different types of data for different periods:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Google Analytics data</strong> is retained for 14 months, after which it is automatically deleted.</li>
                        <li><strong>Purchase records</strong> are retained by Paddle in accordance with their retention policy for financial record-keeping purposes.</li>
                        <li><strong>Local and session storage</strong> data is cleared when you close your browser (session storage) or is limited to a 24-hour window (local storage).</li>
                        <li><strong>Server logs</strong> (if any) are retained for no longer than 30 days.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
                    <p>
                        Depending on your location (including if you are in the EU/EEA, UK, or California), you may have the following rights over your personal data:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Right to Access</strong> — Request a copy of the personal data we hold about you.</li>
                        <li><strong>Right to Deletion</strong> — Request that we delete your personal data.</li>
                        <li><strong>Right to Opt-Out</strong> — Opt out of Google Analytics tracking (you can use a browser extension like <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google's opt-out add-on</a>).</li>
                        <li><strong>Right to Rectification</strong> — Request correction of inaccurate data.</li>
                        <li><strong>Right to Data Portability</strong> — Request a copy of your data in a machine-readable format.</li>
                    </ul>
                    <p>
                        To exercise any of these rights, please contact us using the information below. We will respond to your request within 30 days.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
                    <p>
                        WebPit is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us so we can delete it.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. If significant changes are made, we may notify you through the website or via email (if we have your contact information).
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact</h2>
                    <p className="mb-6">
                        If you have any questions about this Privacy Policy or how your data is handled, please reach out:
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
