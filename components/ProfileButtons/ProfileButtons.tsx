import ArrowRight from "@/assets/icons/arrow-right.svg";
import FingerPrint from "@/assets/icons/finger-print.svg";
import Logout from "@/assets/icons/logout.svg";
import Pencil from "@/assets/icons/pencil.svg";
import SquarePassword from "@/assets/icons/square-password.svg";
import { Typography } from "@/components";
import { cn } from "@/utils/cn";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface ProfileButtonProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  showBorder?: boolean;
  className?: string;
  disabled?: boolean;
}

interface ProfileButtonsProps {
  onEditProfile: () => void;
  onBiometricLogin: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
  biometricEnabled: boolean;
  biometricSupported: boolean;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({
  icon,
  title,
  onPress,
  showBorder = true,
  className = "",
  disabled = false,
}) => (
  <TouchableOpacity
    className={cn(
      `w-full pb-4 px-3 flex-row justify-between items-center ${
        showBorder ? "border-b border-borderLight" : ""
      } ${disabled ? "opacity-50" : ""}`,
      className
    )}
    onPress={disabled ? undefined : onPress}
    disabled={disabled}
  >
    <View className="flex flex-row items-center gap-2">
      <View className="bg-gray-50 rounded-full p-2">{icon}</View>
      <Typography variant="body2" className={disabled ? "text-gray-400" : ""}>
        {title}
      </Typography>
    </View>
    {!disabled && <ArrowRight />}
  </TouchableOpacity>
);

const ProfileButtons: React.FC<ProfileButtonsProps> = ({
  onEditProfile,
  onBiometricLogin,
  onChangePassword,
  onLogout,
  biometricEnabled,
  biometricSupported,
}) => {
  return (
    <View className="bg-white border mt-4 border-borderLight px-2 rounded-lg gap-4 flex flex-col">
      <ProfileButton
        icon={<Pencil />}
        title="Edit Profile"
        onPress={onEditProfile}
        className="py-4"
      />

      <ProfileButton
        icon={<FingerPrint />}
        title={
          biometricEnabled ? "Disable Biometric Login" : "Login with Biometric"
        }
        onPress={onBiometricLogin}
        disabled={!biometricSupported}
      />

      <ProfileButton
        icon={<SquarePassword />}
        title="Change Password"
        onPress={onChangePassword}
      />

      <ProfileButton
        icon={<Logout />}
        title="Logout"
        onPress={onLogout}
        showBorder={false}
      />
    </View>
  );
};

export default ProfileButtons;
