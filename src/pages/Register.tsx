
import RegisterForm from "@/components/auth/RegisterForm";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center kala-pattern p-4 py-8">
      <div className="mb-8">
        <Link to="/" className="text-3xl font-bold text-center">
          <span className="text-kala-primary">Kala</span>
          <span className="text-kala-accent">kriti</span>
        </Link>
      </div>
      <RegisterForm />
    </div>
  );
};

export default Register;
