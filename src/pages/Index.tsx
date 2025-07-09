
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        const mapped = data.map(post => ({
          id: String(post.id),
          title: post.title || 'Başlıq yoxdur',
          description: post.content || 'Məzmun yoxdur',
          image_url: post.image_url || 'https://via.placeholder.com/400x200?text=No+Image',
          category: post.category || 'Kateqoriya yoxdur',
          created_at: post.created_at
        }));
        console.log('Supabase posts:', mapped);
        setPosts(mapped);
        setFilteredPosts(mapped);
      } else {
        console.error('Supabase post fetch error:', error);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const categories = Array.from(new Set(posts.map(post => post.category)));

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === selectedCategory));
    }
  }, [selectedCategory, posts]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Texnologiya <span className="text-sky-500">Bloqu</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI, proqramlaşdırma, mobil texnologiyalar və startaplar haqqında 
            ən son yenilikləri və təhlilləri izləyin
          </p>
        </section>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-sky-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Bu kateqoriyada hələ məqalə yoxdur.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
