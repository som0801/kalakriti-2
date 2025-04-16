
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "small" | "medium" | "large" | "xlarge";
  withText?: boolean;
}

const Logo = ({ size = "medium", withText = true }: LogoProps) => {
  const sizeClasses = {
    small: "h-6 w-auto",
    medium: "h-10 w-auto",
    large: "h-16 w-auto",
    xlarge: "h-24 w-auto" // New size for an extra large logo
  };

  return (
    <div className="flex items-center">
      <Link to="/home" className="flex items-center">
        <img 
          src="/lovable-uploads/4d546b3f-abd7-4e31-bdb7-5b637ea046ff.png" 
          alt="Kalakriti Logo" 
          className={`${sizeClasses[size]}`}
        />
        {withText && (
          <div className="hidden md:block text-2xl font-bold ml-2 text-kala-primary">
            <span className="text-kala-primary">Kala</span>
            <span className="text-kala-accent">kriti</span>
          </div>
        )}
      </Link>
    </div>
  );
};

export default Logo;
