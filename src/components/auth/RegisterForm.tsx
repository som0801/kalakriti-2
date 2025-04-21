
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Basic form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    artType: "",
    description: "",
    contactNumber: "",
    preferredLanguage: "english",
    socialMedia: "",
    experienceLevel: "beginner",
    additionalSkills: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Registration successful! Please check your email to verify your account.");
      setIsLoading(false);
      navigate("/login");
    }, 1500);
  };

  const experienceLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "expert", label: "Expert" }
  ];

  const languages = [
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi" },
    { value: "bengali", label: "Bengali" },
    { value: "tamil", label: "Tamil" },
    { value: "telugu", label: "Telugu" },
    { value: "marathi", label: "Marathi" },
    { value: "gujarati", label: "Gujarati" },
    { value: "kannada", label: "Kannada" },
    { value: "malayalam", label: "Malayalam" },
    { value: "punjabi", label: "Punjabi" }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto animate-fade-in mb-8">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-kala-primary">Join Kalakriti</CardTitle>
        <CardDescription className="text-center">
          Create your account to showcase your handicraft and connect with the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="input-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input-primary"
              />
            </div>

            {/* Artist Information */}
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                placeholder="Your phone number"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="input-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferredLanguage">Preferred Language</Label>
              <Select 
                value={formData.preferredLanguage}
                onValueChange={(value) => handleSelectChange("preferredLanguage", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(language => (
                    <SelectItem key={language.value} value={language.value}>{language.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="artType">Type of Artwork/Handicraft</Label>
              <Input
                id="artType"
                name="artType"
                placeholder="E.g., Pottery, Weaving, Painting"
                value={formData.artType}
                onChange={handleChange}
                required
                className="input-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select 
                value={formData.experienceLevel}
                onValueChange={(value) => handleSelectChange("experienceLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="socialMedia">Social Media Links</Label>
              <Input
                id="socialMedia"
                name="socialMedia"
                placeholder="Instagram, Facebook, etc."
                value={formData.socialMedia}
                onChange={handleChange}
                className="input-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalSkills">Additional Skills</Label>
              <Input
                id="additionalSkills"
                name="additionalSkills"
                placeholder="E.g., Photography, Marketing"
                value={formData.additionalSkills}
                onChange={handleChange}
                className="input-primary"
              />
            </div>
          </div>

          {/* Full-width fields */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Your full address"
              value={formData.address}
              onChange={handleChange}
              required
              className="input-primary min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description of Art/Products</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Tell us about your art and products"
              value={formData.description}
              onChange={handleChange}
              required
              className="input-primary min-h-[120px]"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-kala-primary hover:bg-kala-secondary"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-kala-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
