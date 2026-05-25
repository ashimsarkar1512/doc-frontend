export type DeveloperAppConfig = {
  /* 1 */ appId: string;
  /* 2 */ auth?: {
    clientId?: string;
    mode?: "popup" | "iframe" | "redirect";
  };
};
