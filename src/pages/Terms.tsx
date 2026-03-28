import React from 'react';
import { motion } from 'motion/react';
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
                        By using WebPit, you agree to these simple terms. If you don't agree, please do not use the service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Usage License</h2>
                    <p>
                        WebPit is a free tool provided for your personal or commercial use. You can use it as often as you like to optimize your website, blog, or store images.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">3. No Guarantees</h2>
                    <p>
                        While we strive for the best possible compression, we provide this tool "as is." We cannot guarantee that every image will result in a specific file size or quality level. The final result depends heavily on the original file provided.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Limitations of Liability</h2>
                    <p>
                        WebPit is not responsible for any data loss, quality issues, or browser crashes that might occur during the processing of your images. Since everything happens locally on your computer, you retain full responsibility for your original files.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Modifications</h2>
                    <p>
                        We may update these terms or the tool itself from time to time to improve performance or security.
                    </p>
                </section>

                <p className="text-xs text-slate-400 pt-8 border-t border-slate-100 mt-12">
                    Last updated: March 3, 2026
                </p>
            </div>
        </motion.div>
    );
}
