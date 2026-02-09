import "./globals.css";

export const metadata = {
  title: "Task Management System",
  description : "A simple task management system built with Next.js and Tailwind CSS",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
