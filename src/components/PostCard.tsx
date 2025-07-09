
import { useState } from "react";
import { Heart, Share2, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
  likes?: number;
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link kopyalandı!");
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
    <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(post.created_at)}
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">
          {post.title}
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.description}
        </p>

        <div className="flex items-center justify-between">
          <Link
            to={`/post/${post.id}`}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Oxu
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={handleShare}
              className="text-gray-500 hover:text-sky-500 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
