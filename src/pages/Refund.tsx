import React from 'react';
import { motion } from 'motion/react';
import { useSEO } from '../hooks/useSEO';

export default function Refund() {
  useSEO({
    title: 'Refund Policy | WebPit',
    description: 'WebPit offers a 14-day no-questions-asked refund policy for the desktop app.',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-16 px-4 sm:px-6"
    >
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
          Refund Policy
        </h1>
        <p className="text-slate-500 text-lg">Simple and fair — no hoops to jump through.</p>
      </div>

      <div className="bg-white p-8 md:p-12 lg:p-16 rounded-[2.5rem] border border-slate-200/50 shadow-sm prose prose-slate max-w-none text-slate-600 leading-relaxed">

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">14-Day Money-Back Guarantee</h2>
          <p>
            If you're not satisfied with WebPit for Desktop for any reason, you can request a full refund
            within <strong>14 days</strong> of your purchase date. No questions asked.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Request a Refund</h2>
          <p>
            Send an email to{' '}
            <a
              href="mailto:usman.hyder37@outlook.com"
              className="text-blue-600 hover:underline"
            >
              usman.hyder37@outlook.com
            </a>{' '}
            with the subject line <strong>"Refund Request"</strong> and include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The email address used at checkout</li>
            <li>Your order number (found in your purchase confirmation email)</li>
          </ul>
          <p>
            We'll process your refund within <strong>2 business days</strong> and you'll receive a
            confirmation email once it's done. Refunds are returned to the original payment method.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Eligibility</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Refund requests must be made within 14 days of the original purchase date.</li>
            <li>This policy applies to the WebPit Desktop App only.</li>
            <li>The web tool at webpit.site is free and not subject to this policy.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Questions</h2>
          <p>
            If you have any questions about this policy or your purchase, reach out at{' '}
            <a
              href="mailto:usman.hyder37@outlook.com"
              className="text-blue-600 hover:underline"
            >
              usman.hyder37@outlook.com
            </a>
            . We typically respond within 24 hours on weekdays.
          </p>
        </section>

        <p className="text-xs text-slate-400 pt-8 border-t border-slate-100 mt-12">
          Last updated: May 7, 2026
        </p>
      </div>
    </motion.div>
  );
}
