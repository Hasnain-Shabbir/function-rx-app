export const avatarSizeMap = {
  /** 16px */
  xs: "w-4 h-4",

  /** 24px */
  sm: "w-6 h-6",

  /** 32px */
  md: "w-8 h-8",

  /** 48px */
  lg: "w-[48px] h-[48px]",

  /** 56px */
  xl: "w-14 h-14",

  /** 64px */
  "2xl": "w-16 h-16",

  /** 72px */
  "3xl": "w-18 h-18",

  /** 80px */
  "4xl": "w-20 h-20",
};

export type AvatarSize = keyof typeof avatarSizeMap;

export const avatarRadiusMap: Record<keyof typeof avatarSizeMap, string> = {
  xs: "rounded-[2px]", // 16px
  sm: "rounded-[4px]", // 24px
  md: "rounded-[8px]", // 32px
  lg: "rounded-[10px]", // 48px
  xl: "rounded-md", // 56px
  "2xl": "rounded-[14px]", // 64px → ~14px
  "3xl": "rounded-[16px]", // 72px
  "4xl": "rounded-[16px]", // 80px
};

export const avatarImgSizeMap = {
  xs: { width: 16, height: 16 },
  sm: { width: 24, height: 24 },
  md: { width: 32, height: 32 },
  lg: { width: 48, height: 48 },
  xl: { width: 56, height: 56 },
  "2xl": { width: 64, height: 64 },
  "3xl": { width: 72, height: 72 },
  "4xl": { width: 80, height: 80 },
};
