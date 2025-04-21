import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Save, User, Instagram, Facebook, Twitter, Link as LinkIcon, LogOut, Camera, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLogout } from "@/hooks/useLogout";
import { useLanguage } from "@/context/LanguageContext";

const Profile = () => {
  const { user } = useAuth();
  const { logout } = useLogout();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    artworkType: "Handicraft",
    experience: "Beginner",
    location: "",
    contactNumber: "",
    email: "",
    preferredLanguage: "Hindi",
    skills: ["Photography", "Marketing", "Design"],
    socialMedia: {
      instagram: "",
      facebook: "",
      twitter: "",
      website: ""
    },
    avatar_url: ""
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (!user) return;

      setLoading(true);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      if (profile) {
        setProfileData({
          ...profileData,
          name: profile.full_name || '',
          bio: profile.bio || '',
          email: user.email || '',
          avatar_url: profile.avatar_url || ''
        });
      }

      setLoading(false);
    } catch (error: any) {
      toast.error('Error loading profile data');
      console.error('Error loading profile:', error);
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      if (!user) return;

      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.name,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully');
      setIsEditing(false);
      setLoading(false);
    } catch (error: any) {
      toast.error('Error updating profile');
      console.error('Error updating profile:', error);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0 || !user) {
        return;
      }

      setUploading(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://xihrtxeuuswsucyjetbu.supabase.co'}/functions/v1/init-storage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpaHJ0eGV1dXN3c3VjeWpldGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTQzMDUsImV4cCI6MjA1OTk3MDMwNX0.RWVY2iIgJbf95xYMN8mq6e919KYT7Hgf0WWPNAhBb6s'}`
          }
        });
      } catch (error) {
        console.error('Error calling init-storage function:', error);
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (data) {
        setProfileData({
          ...profileData,
          avatar_url: data.publicUrl
        });

        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            avatar_url: data.publicUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }

        toast.success('Profile picture updated successfully');
      }
    } catch (error: any) {
      toast.error('Error uploading image: ' + (error.message || 'Unknown error'));
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-kala-primary">{t('artistProfile')}</h1>
        <div className="flex space-x-2">
          <Button 
            onClick={isEditing ? handleSave : handleEditToggle} 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={loading}
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            {isEditing ? t('save') : t('editProfile')}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('profileOptions')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleProfilePictureClick}
                className="flex items-center cursor-pointer"
              >
                <Camera className="mr-2 h-4 w-4" />
                <span>{t('changeProfilePicture')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout} 
                className="flex items-center cursor-pointer text-red-600 hover:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-24 w-24 mb-4 cursor-pointer group" onClick={handleProfilePictureClick}>
                <AvatarImage src={profileData.avatar_url || "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=250"} alt={profileData.name} />
                <AvatarFallback className="bg-kala-primary text-white text-2xl">
                  {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('') : <User />}
                </AvatarFallback>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white h-8 w-8" />
                </div>
              </Avatar>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
                disabled={uploading}
              />
              {!isEditing && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 h-auto font-normal"
                  onClick={handleProfilePictureClick}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : t('changeProfilePicture')}
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="w-full space-y-4">
                <div>
                  <Label htmlFor="name">{t('fullName')}</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={profileData.name} 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="avatar_url">Avatar URL</Label>
                  <Input 
                    id="avatar_url" 
                    name="avatar_url" 
                    value={profileData.avatar_url} 
                    onChange={handleChange} 
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="artworkType">{t('artworkType')}</Label>
                  <Input 
                    id="artworkType" 
                    name="artworkType" 
                    value={profileData.artworkType} 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="experience">{t('experience')}</Label>
                  <Input 
                    id="experience" 
                    name="experience" 
                    value={profileData.experience} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-semibold">{profileData.name || "Your Name"}</h2>
                <p className="text-kala-accent font-medium">{profileData.artworkType}</p>
                <Badge className="mt-2 bg-kala-light text-kala-primary hover:bg-kala-light">
                  {profileData.experience}
                </Badge>
              </div>
            )}
            
            <div className="flex gap-3 mt-6">
              <Button size="icon" variant="ghost" className="rounded-full text-gray-600 hover:text-kala-accent hover:bg-kala-light">
                <Instagram size={20} />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full text-gray-600 hover:text-kala-accent hover:bg-kala-light">
                <Facebook size={20} />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full text-gray-600 hover:text-kala-accent hover:bg-kala-light">
                <Twitter size={20} />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full text-gray-600 hover:text-kala-accent hover:bg-kala-light">
                <LinkIcon size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('artistDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="bio">{t('bio')}</Label>
                  <Input 
                    id="bio" 
                    name="bio" 
                    value={profileData.bio} 
                    onChange={handleChange} 
                    className="h-20"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">{t('location')}</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      value={profileData.location} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactNumber">{t('contactNumber')}</Label>
                    <Input 
                      id="contactNumber" 
                      name="contactNumber" 
                      value={profileData.contactNumber} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      value={profileData.email} 
                      onChange={handleChange} 
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredLanguage">{t('preferredLanguage')}</Label>
                    <Input 
                      id="preferredLanguage" 
                      name="preferredLanguage" 
                      value={profileData.preferredLanguage} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('bio')}</h3>
                  <p className="mt-1">{profileData.bio || "Add your bio to tell others about yourself and your artwork"}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('location')}</h3>
                    <p className="mt-1">{profileData.location || "Add your location"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('contactNumber')}</h3>
                    <p className="mt-1">{profileData.contactNumber || "Add your contact number"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('email')}</h3>
                    <p className="mt-1">{profileData.email || user?.email || "Add your email"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('preferredLanguage')}</h3>
                    <p className="mt-1">{profileData.preferredLanguage}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('skills')}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.skills.map((skill, index) => (
                      <Badge key={index} className="bg-kala-light text-kala-primary hover:bg-kala-light">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>{t('myPortfolio')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="rounded-lg overflow-hidden group relative">
                  <img 
                    src={`https://source.unsplash.com/random/300x300?handicraft=${item}`} 
                    alt={`Portfolio item ${item}`} 
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-3 text-white">
                      <p className="font-medium">Artwork Title</p>
                      <p className="text-sm opacity-80">Traditional Handicraft</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button variant="outline" className="text-kala-primary border-kala-primary hover:bg-kala-light">
                {t('viewAllWork')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
