import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";

import UserAvatar from "@/assets/images/user-avatar.png";
import type { AvatarProps } from "./Avatar.types";
import { avatarImgSizeMap, avatarRadiusMap, avatarSizeMap } from "./avatarData";

const Avatar: React.FC<AvatarProps> = ({
  style,
  alt,
  src,
  size = "xl",
  imgStyles,
  type = "rounded",
  ...props
}) => {
  const avatarSize = avatarSizeMap[size];
  const fallbackSrc = UserAvatar;
  const [imgSrc, setImgSrc] = useState<any>(src ? { uri: src } : fallbackSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src) {
      setImgSrc({ uri: src });
      setHasError(false);
    } else {
      setImgSrc(fallbackSrc);
      setHasError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const avatarRadius =
    type === "rectangle" ? avatarRadiusMap[size] : "rounded-full";
  const avatarImgSize = avatarImgSizeMap[size];

  return (
    <View
      className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-gray-100 ${avatarSize} ${avatarRadius}`}
      style={style}
      {...props}
    >
      <Image
        source={imgSrc}
        alt={alt || "avatar"}
        className={`h-full w-full ${imgStyles || ""}`}
        style={{
          width: avatarImgSize.width,
          height: avatarImgSize.height,
        }}
        onError={() => {
          if (!hasError) {
            setImgSrc(fallbackSrc);
            setHasError(true);
          }
        }}
        resizeMode="cover"
      />
    </View>
  );
};

export default Avatar;
