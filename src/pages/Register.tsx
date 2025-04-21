
import RegisterForm from "@/components/auth/RegisterForm";
import Logo from "@/components/ui/logo";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center kala-pattern p-4 py-8">
      <div className="mb-8 flex flex-col items-center">
        <Logo size="large" withText={false} />
        <Link to="/" className="text-3xl font-bold text-center mt-2">
          <span className="text-kala-primary">Kala</span>
          <span className="text-kala-accent">kriti</span>
        </Link>
      </div>
      <RegisterForm />
    </div>
  );
};

export default Register;
