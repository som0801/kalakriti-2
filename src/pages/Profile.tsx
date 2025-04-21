
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Save, User, Instagram, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Rajesh Kumar",
    bio: "Expert woodcarver from Jaipur with 15 years of experience creating traditional Rajasthani wooden artifacts.",
    artworkType: "Wood Carving",
    experience: "Expert",
    location: "Jaipur, Rajasthan",
    contactNumber: "+91 98765 43210",
    email: "rajesh.kumar@example.com",
    preferredLanguage: "Hindi",
    skills: ["Photography", "Marketing", "Design"],
    socialMedia: {
      instagram: "rajesh_woodart",
      facebook: "rajeshkumarwoodart",
      twitter: "rajesh_creates",
      website: "www.rajeshwoodart.com"
    }
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // In a real app, you would save changes to the backend here
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-kala-primary">Artist Profile</h1>
        <Button 
          onClick={handleEditToggle} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          {isEditing ? "Save" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=250" alt={profileData.name} />
              <AvatarFallback className="bg-kala-primary text-white text-2xl">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            {isEditing ? (
              <div className="w-full space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={profileData.name} 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="artworkType">Artwork Type</Label>
                  <Input 
                    id="artworkType" 
                    name="artworkType" 
                    value={profileData.artworkType} 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience Level</Label>
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
                <h2 className="text-xl font-semibold">{profileData.name}</h2>
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

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Artist Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="bio">Bio</Label>
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
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      value={profileData.location} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input 
                      id="contactNumber" 
                      name="contactNumber" 
                      value={profileData.contactNumber} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      value={profileData.email} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredLanguage">Preferred Language</Label>
                    <Input 
                      id="preferredLanguage" 
                      name="preferredLanguage" 
                      value={profileData.preferredLanguage} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button onClick={handleSave} className="bg-kala-primary hover:bg-kala-secondary">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                  <p className="mt-1">{profileData.bio}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1">{profileData.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                    <p className="mt-1">{profileData.contactNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{profileData.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Preferred Language</h3>
                    <p className="mt-1">{profileData.preferredLanguage}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Skills</h3>
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

        {/* Portfolio Section */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>My Portfolio</CardTitle>
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
                      <p className="text-sm opacity-80">Traditional Wooden Handicraft</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button variant="outline" className="text-kala-primary border-kala-primary hover:bg-kala-light">
                View All Work
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
