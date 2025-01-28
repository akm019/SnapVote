// app/layout.js
import Navbar from './components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Poll App',
  description: 'A simple poll application built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}