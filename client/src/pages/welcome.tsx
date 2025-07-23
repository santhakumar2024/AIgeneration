import { UserRole } from "@/lib/types";
import RoleSelection from "@/components/role-selection";

interface WelcomeProps {
  onSelectRole: (role: UserRole) => void;
}

export default function Welcome({ onSelectRole }: WelcomeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-soft-bg">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-purple mb-4">
            Welcome to Decode My Care™
          </h1>
          <div className="w-24 h-1 bg-accent-teal mx-auto mb-6"></div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <p className="text-lg md:text-xl leading-relaxed mb-6">
            You've just been through a medical visit—maybe at a hospital, during telemedicine, or with your doctor.
          </p>
          <p className="text-lg md:text-xl leading-relaxed mb-6">
            We know that even after care ends, the questions don't.
          </p>
          <p className="text-lg md:text-xl leading-relaxed mb-6">
            If you've ever left feeling confused, unsure, or like you missed something important—you're not alone.
          </p>
          <div className="bg-soft-bg rounded-xl p-6">
            <p className="text-lg font-medium text-primary-purple mb-2">
              We're here to help you make sense of it all. Simply. Clearly. With care.
            </p>
            <p className="text-sm text-gray-600">
              No downloads. No logins. Just support when you need it most.
            </p>
          </div>
        </div>

        <RoleSelection onSelectRole={onSelectRole} />
      </div>
    </div>
  );
}
