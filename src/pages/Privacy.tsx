import React from 'react';
import { motion } from 'motion/react';

export default function Privacy() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto py-12 px-4 sm:px-6"
        >
            <h1 className="text-4xl font-bold tracking-tight text-black mb-8">Privacy Policy</h1>

            <div className="prose prose-slate max-w-none space-y-6 text-gray-600">
                <section>
                    <h2 className="text-2xl font-semibold text-black mb-4">Your Privacy is Our Priority</h2>
                    <p>
                        At WebPit, we believe your photos are your business. That's why we built our tool to be 100% private.
                        Unlike other online converters, we do not upload your images to any server. All processing—including conversion and compression—happens right in your browser.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-black mb-4">What Data We Collect</h2>
                    <p>
                        The short answer: <strong>None.</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>We do not store your images.</li>
                        <li>We do not collect personal information.</li>
                        <li>We do not track your identity through cookies.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-black mb-4">How It Works</h2>
                    <p>
                        WebPit uses your device's own power (CPU/GPU) to handle the image math. When you drop an image here, your browser temporarily holds it in its memory, performs the conversion to WebP, and lets you download the result. Once you close the tab, that temporary data is wiped clean.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-black mb-4">Analytics</h2>
                    <p>
                        We use minimal, high-level analytics (via Vercel Speed Insights) simply to see how fast the site loads and if there are technical errors. This data is anonymous and does not include your images or personal details.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-black mb-4">Contact</h2>
                    <p>
                        If you have any questions about our privacy-first approach, feel free to reach out via our GitHub repository.
                    </p>
                </section>

                <p className="text-sm text-gray-400 pt-8">
                    Last updated: March 3, 2026
                </p>
            </div>
        </motion.div>
    );
}
