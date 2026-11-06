import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CourseGlide | Substantive Course, TA & Curriculum Intelligence",
  description:
    "Next-generation course, instructor, and TA review platform for the University of Waterloo—designed to match learning styles, elevate TA teaching portfolios, and drive closed-loop school curriculum improvements.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased selection:bg-amber-300 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
