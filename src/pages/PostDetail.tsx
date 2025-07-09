
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Tag, Heart, Share2, ArrowLeft, Facebook, Twitter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) {
        setPost(data);
        setLikes(data.likes || 0);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) return <div>Yüklənir...</div>;
  if (!post) return <div>Xəbər tapılmadı</div>;

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post.title;
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      default:
        if (navigator.share) {
          navigator.share({ title: text, url });
        } else {
          navigator.clipboard.writeText(url);
          alert("Link kopyalandı!");
        }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("az-AZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-sky-500 hover:text-sky-600 mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Ana səhifəyə qayıt</span>
          </Link>

          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Hero Image */}
            <div className="relative">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-sky-500 text-white px-4 py-2 rounded-full font-medium">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="p-8">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4" />
                  <span>{post.category}</span>
                </div>
                {/* Müəllif sahəsi yoxdur, istəsəniz əlavə edin */}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
                {post.title}
              </h1>

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Social Actions */}
              <div className="border-t pt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isLiked 
                          ? "bg-red-100 text-red-600" 
                          : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                      <span>{likes} Bəyənmə</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 font-medium">Paylaş:</span>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare('share')}
                      className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetail;
