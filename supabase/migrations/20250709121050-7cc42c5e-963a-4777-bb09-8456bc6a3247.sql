
-- Admin istifadəçiləri üçün profil cədvəli yaradırıq
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS (Row Level Security) aktivləşdiririk
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- İstifadəçilər öz profilini görə bilsin
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- İstifadəçilər öz profilini yeniləyə bilsin
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Yeni istifadəçi qeydiyyatdan keçdikdə avtomatik profil yaradılsın
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger yaradırıq
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- İlk admin istifadəçisini əl ilə əlavə etmək üçün funksiya
-- Bu funksiyadan sonra admin panelindən istifadə edə bilərsiniz
-- Admin email və parolunu qeydiyyatdan keçirdikdən sonra bu əmri çalışdırın:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'sizin-admin-email@example.com';
