import { Inter, Fira_Code, Fira_Sans } from "next/font/google";
import "../globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingCheck } from "@/components/layout/OnboardingCheck";

const inter = Inter({ subsets: ["latin"] });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });
const firaSans = Fira_Sans({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira-sans" 
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${inter.className} ${firaCode.variable} ${firaSans.variable}`}>
          <OnboardingCheck>
            <div className="flex h-screen overflow-hidden bg-[#FAF5FF]">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                  {children}
                </main>
              </div>
            </div>
          </OnboardingCheck>
        </body>
      </html>
    </AuthProvider>
  );
}