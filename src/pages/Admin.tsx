import { useState, useEffect } from "react";
import { Lock, Plus, Edit3, Trash2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: ""
  });
  const { toast } = useToast();

  const categories = ["AI", "Proqramlaşdırma", "Mobil Texnologiyalar", "Startaplar", "Blockchain", "Təhlükəsizlik"];

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await checkUserRole(session.user.id);
        await fetchPosts();
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }
      
      setUserRole(data?.role || 'user');
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }
      
      // Transform data to match our interface
      const transformedPosts = data?.map(post => ({
        id: String(post.id),
        title: post.title || 'Başlıq yoxdur',
        description: post.content || 'Məzmun yoxdur',
        image_url: post.image_url || 'https://via.placeholder.com/400x200?text=No+Image',
        category: post.category || 'Kateqoriya yoxdur',
        created_at: post.created_at
      })) || [];
      console.log('Admin panel posts:', transformedPosts);
      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      });
      
      if (error) {
        toast({
          title: "Giriş Xətası",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Uğurlu Giriş",
        description: "Admin panelinə xoş gəlmisiniz!",
      });
      
      // Refresh user data
      await checkUser();
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Giriş Xətası",
        description: "Giriş zamanı xəta baş verdi",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      } else {
        setUser(null);
        setUserRole('');
        setPosts([]);
        toast({
          title: "Çıxış",
          description: "Uğurla çıxış etdiniz",
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPost) {
        // Update existing post - convert string ID to number
        const { error } = await supabase
          .from('posts')
          .update({
            title: formData.title,
            content: formData.description,
            image_url: formData.image_url,
            category: formData.category
          })
          .eq('id', parseInt(editingPost.id));
        
        if (error) {
          toast({
            title: "Xəta",
            description: "Məqalə yenilənmədi",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Uğurlu",
          description: "Məqalə yeniləndi",
        });
      } else {
        // Add new post
        const { error } = await supabase
          .from('posts')
          .insert({
            title: formData.title,
            content: formData.description,
            image_url: formData.image_url,
            category: formData.category
          });
        
        if (error) {
          console.error('Supabase insert error:', error);
          toast({
            title: "Xəta",
            description: error.message,
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Uğurlu",
          description: "Yeni məqalə əlavə edildi",
        });
      }
      
      setFormData({ title: "", description: "", image_url: "", category: "" });
      setShowForm(false);
      setEditingPost(null);
      await fetchPosts();
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Xəta",
        description: "Əməliyyat başa çatmadı",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      description: post.description,
      image_url: post.image_url,
      category: post.category
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu məqaləni silmək istədiyinizə əminsiniz?")) {
      return;
    }
    
    try {
      // Convert string ID to number for database operation
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) {
        toast({
          title: "Xəta",
          description: "Məqalə silinmədi",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Uğurlu",
        description: "Məqalə silindi",
      });
      
      await fetchPosts();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Xəta",
        description: "Silmə əməliyyatı başa çatmadı",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Yüklənir...</div>
      </div>
    );
  }

  if (!user || userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 text-sky-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900">Admin Girişi</h1>
            <p className="text-gray-600">Bu səhifəyə daxil olmaq üçün admin hesabı lazımdır</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parol
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Daxil Ol
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Məlumat:</strong> Admin hesabı yaratmaq üçün əvvəlcə qeydiyyatdan keçin, sonra admin rolunu verilənlər bazasında dəyişdirin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Xoş gəlmisiniz, {user.email}</span>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingPost(null);
                  setFormData({ title: "", description: "", image_url: "", category: "" });
                }}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Yeni Məqalə</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Çıxış
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {editingPost ? "Məqaləni Redaktə Et" : "Yeni Məqalə Əlavə Et"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlıq
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Məzmun
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şəkil URL-i
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kateqoriya
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                >
                  <option value="">Kateqoriya seçin</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  {editingPost ? "Yenilə" : "Əlavə Et"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPost(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Ləğv Et
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-slate-900">Məqalələr ({posts.length})</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Məqalə
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Əməliyyatlar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {post.title.substring(0, 50)}...
                          </div>
                          <div className="text-sm text-gray-500">
                            {post.description.substring(0, 80)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString("az-AZ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
