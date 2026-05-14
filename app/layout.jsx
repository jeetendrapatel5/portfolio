import "./globals.css";

export const metadata = {
  title: "Jeetendra Patel | Full-Stack Developer",
  description:
    "A premium black-and-white portfolio for Jeetendra Patel, a full-stack developer building polished products with Next.js, React, Node.js, PostgreSQL, Prisma, Redis, and strong system design.",
  keywords: [
    "Jeetendra Patel",
    "Full-stack developer",
    "Next.js developer",
    "React developer",
    "Node.js developer",
    "PostgreSQL",
    "Prisma ORM",
    "Redis",
    "System design",
  ],
  authors: [{ name: "Jeetendra Patel" }],
  openGraph: {
    title: "Jeetendra Patel | Full-Stack Developer",
    description:
      "Premium portfolio of Jeetendra Patel, focused on production-grade full-stack products, elegant interfaces, and reliable systems.",
    type: "website",
    locale: "en_IN",
    siteName: "Jeetendra Patel Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeetendra Patel | Full-Stack Developer",
    description:
      "Full-stack developer crafting refined web products with React, Next.js, Node.js, PostgreSQL, Prisma, Redis, and system design.",
  },
};

export const viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
