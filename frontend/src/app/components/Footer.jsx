
'use client'

export default function Footer() {
    return(
<footer className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-8 mt-16 transition-colors duration-500">
  <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
    {/* Branding / Logo */}
    <div className="text-center md:text-left">
      <h3 className="text-xl font-bold">SocialXN Helpdesk</h3>
      <p className="text-sm mt-1">Support made simple. Manage tickets & connect with agents.</p>
    </div>

    {/* Navigation Links */}
    <div className="flex flex-col sm:flex-row gap-4 text-center md:text-left">
      <a href="/" className="hover:underline">Home</a>
      <a href="/tickets/new" className="hover:underline">Submit Ticket</a>
      <a href="/knowledge-base" className="hover:underline">Knowledge Base</a>
      <a href="/announcements" className="hover:underline">Announcements</a>
      <a href="/faqs" className="hover:underline">FAQs</a>
    </div>

    {/* Social / Contact */}
    <div className="flex gap-4">
      <a href="mailto:support@socialxn.com" className="hover:underline">Contact</a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
    </div>
  </div>

  {/* Bottom Note */}
  <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
    &copy; {new Date().getFullYear()} SocialXN Helpdesk. All rights reserved.
  </div>
</footer>
);
}
