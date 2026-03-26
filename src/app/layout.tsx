import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "./providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={plusJakartaSans.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
