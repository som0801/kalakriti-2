
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  className?: string;
}

export const BackButton = ({ className }: BackButtonProps) => {
  const navigate = useNavigate();
  
  const goBack = () => {
    navigate(-1);
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={goBack}
      className={`flex items-center space-x-1 text-gray-600 hover:text-kala-primary ${className}`}
    >
      <ChevronLeft className="h-5 w-5" />
      <span>Back</span>
    </Button>
  );
};

export default BackButton;
