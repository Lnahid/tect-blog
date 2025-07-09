
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-red-500 fill-current" />
          <span>by Nahid Zeynalov</span>
        </div>
        <p className="text-slate-400">
          © 2025 Nahid Zeynalov – Texnologiya Bloqu
        </p>
      </div>
    </footer>
  );
};

export default Footer;
