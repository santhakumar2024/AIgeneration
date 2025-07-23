import { UserRole } from "@/lib/types";
import { User, Heart, HandHeart } from "lucide-react";

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const roles = [
    {
      id: 'patient' as UserRole,
      title: 'I am a patient',
      icon: User,
      description: "We're here to help you feel steady and supported after your visit. One step at a time."
    },
    {
      id: 'caregiver' as UserRole,
      title: 'I am a caregiver',
      icon: Heart,
      description: "Thank you for being there. We know it's hard sometimes — let's make this part easier together."
    },
    {
      id: 'supporter' as UserRole,
      title: 'Community supporter',
      icon: HandHeart,
      description: "Thank you for showing up. Whether you're EMS, faith leader, or trusted friend — your support matters."
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-primary-purple mb-6">
        Who's using this today?
      </h2>
      <p className="text-gray-600 mb-8">Select to personalize your experience — no login required.</p>
      
      <div className="grid md:grid-cols-3 gap-4">
        {roles.map((role) => {
          const IconComponent = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-accent-teal hover:shadow-md transition-all duration-300 text-left group"
            >
              <div className="flex items-center mb-4">
                <IconComponent className="text-accent-teal text-2xl mr-3 w-6 h-6" />
                <h3 className="text-lg font-semibold text-primary-purple">{role.title}</h3>
              </div>
              <p className="text-sm text-gray-600 group-hover:text-warm-text">
                {role.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
