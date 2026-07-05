export interface FileAsset {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  context:
    | "WEBSITE_LOGO"
    | "WEBSITE_FAVICON"
    | "WEBSITE_SOCIAL_PREVIEW"
    | string;
  uploadedById: string;
  productId: string | null;
  conversationId: string | null;
  messageId: string | null;
  sideEffectReportId: string | null;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface Office {
  id: string;
  siteId: string;
  name: string;
  address: string;
  isActive: boolean;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface SocialLink {
  name: "facebook" | "instagram" | "twitter" | "linkedin" | string;
  url: string;
}

export interface ContactInfo {
  siteId: string;
  phone: string;
  email: string;
  openHours: string;
  closedDays: string;
}

export interface GoogleAnalytics {
  siteId: string;
  gaMeasurementId: string;
}

export interface WeightLossMDSite {
  id: string;
  title: string;
  metaDescription: string;
  whiteLogoId: string;
  blackLogoId: string;
  faviconLightId: string;
  faviconDarkId: string;
  socialPreviewId: string;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
  offices: Office[];
  socialLinks: SocialLink[];
  whiteLogo: FileAsset;
  blackLogo: FileAsset;
  faviconLight: FileAsset;
  faviconDark: FileAsset;
  socialPreview: FileAsset;
  contactInfo: ContactInfo;
  googleAnalytics: GoogleAnalytics;
}
