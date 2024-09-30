import "./globals.css";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className='bg-gray-50 w-screen h-screen'>
          <div className='relative w-full h-screen max-w-[420px] bg-white mx-auto my-0 overflow-hidden'>
            <Header />
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
