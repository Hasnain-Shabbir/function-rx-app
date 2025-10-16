import AwardLogo1 from "@/assets/icons/award-badge-1.svg";
import AwardLogo2 from "@/assets/icons/award-badge-2.svg";
import AwardLogo3 from "@/assets/icons/award-badge-3.svg";
import Fire from "@/assets/icons/fire.svg";
import Star from "@/assets/icons/star.svg";
import { Avatar, Typography } from "@/components";
import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface UserInfoCardProps {
  name: string;
  email: string;
  streak: number;
  personalBest: number;
  imageUrl?: string | null;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  name,
  email,
  streak,
  personalBest,
  imageUrl,
}) => {
  return (
    <View className="bg-white border pb-3 border-borderLight p-4 rounded-lg gap-4 flex items-center">
      <Avatar size="4xl" src={imageUrl || undefined} />
      <View className="flex items-center gap-1">
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2" className="text-medium">
          {email}
        </Typography>

        {/* Award badges */}
        <View className="flex-row items-center justify-center">
          <AwardLogo1 />
          <AwardLogo2 style={{ marginLeft: -17 }} />
          <AwardLogo3 style={{ marginLeft: -17 }} />
          <View className="relative" style={{ marginLeft: -17 }}>
            <Svg width={40} height={34} viewBox="0 0 40 34" fill="none">
              <Path
                d="M39.165 14.942C39.925 16.2087 39.925 17.7913 39.165 19.058L31.365 32.058C30.6421 33.2628 29.3401 34 27.935 34L12.0645 34C10.6595 34 9.35746 33.2628 8.63457 32.058L0.834571 19.058C0.0745346 17.7913 0.0745347 16.2087 0.834575 14.942L8.63457 1.94201C9.35747 0.737192 10.6595 -1.29999e-06 12.0645 -1.23857e-06L27.935 -5.44852e-07C29.3401 -4.83435e-07 30.6421 0.737195 31.365 1.94202L39.165 14.942Z"
                fill="#F9F9F9"
              />
            </Svg>
            <Typography
              variant="caption"
              fontWeight="semibold"
              className="absolute left-1/2 -mt-1 -translate-x-1/2 top-1/2 -translate-y-1/2"
            >
              +3
            </Typography>
          </View>
        </View>
      </View>

      {/* Statistics */}
      <View className="flex-row justify-between items-center">
        <View className="w-1/2 items-center">
          <View className="flex flex-row items-center">
            <Typography variant="h6" className="flex items-center">
              {streak}
            </Typography>
            <Fire />
          </View>
          <Typography variant="caption" className="text-medium">
            Streak
          </Typography>
        </View>

        <View className="w-px h-6 bg-gray-300 mx-2" />

        <View className="w-1/2 items-center">
          <View className="flex flex-row items-center">
            <Typography variant="h6" className="flex items-center">
              {personalBest}
            </Typography>
            <Star />
          </View>
          <Typography variant="caption" className="text-medium">
            Personal Best
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default UserInfoCard;
