import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: 'Billore - GST Invoicing & Billing',
  description: 'Modern, fast, and compliant GST Invoicing and Billing Software.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
