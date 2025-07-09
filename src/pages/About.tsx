
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Code2, BookOpen, Users, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Haqqımızda
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Texnologiya dünyasındakı ən son inkişafları və yenilikləri 
              sizinlə paylaşmaq missiyamızdır
            </p>
          </section>

          {/* Story Section */}
          <section className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Bizim Hekayəmiz</h2>
            <div className="prose prose-lg text-gray-600">
              <p className="mb-4">
                Texnologiya bloqu 2025-ci ildə Nahid Zeynalov tərəfindən yaradılmışdır. 
                Məqsədimiz texnologiya sahəsindəki ən son yeniliklər, trendlər və 
                inkişaflar haqqında keyfiyyətli məzmun təqdim etməkdir.
              </p>
              <p className="mb-4">
                Süni intellekt, proqramlaşdırma dilləri, mobil texnologiyalar, 
                blockchain və startup ekosistemi kimi mövzularda dərin təhlillər 
                və praktiki məlumatlar paylaşırıq.
              </p>
              <p>
                Hər məqalə diqqətlə araşdırılmış və texnologiya həvəskarları 
                üçün faydalı məlumatlarla zənginləşdirilmişdir.
              </p>
            </div>
          </section>

          {/* Features Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-sky-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Code2 className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Texniki Məzmun</h3>
              <p className="text-gray-600">Dərin texniki təhlillər və praktiki nümunələr</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Öyrənmə</h3>
              <p className="text-gray-600">Addım-addım təlimatlar və öyrənmə materialları</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">İcma</h3>
              <p className="text-gray-600">Texnologiya həvəskarları üçün birgə platforma</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Məqsəd</h3>
              <p className="text-gray-600">Texnologiya sahəsində bilgilərin paylaşılması</p>
            </div>
          </section>

          {/* Author Section */}
          <section className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl shadow-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Nahid Zeynalov</h2>
            <p className="text-xl mb-4">Founder & Tech Writer</p>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              10+ il texnologiya sahəsində təcrübəsi olan proqramçı və texnologiya 
              analitiki. Frontend və backend inkişafı, AI texnologiyaları və 
              startup ekosistemi üzrə ekspert.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
