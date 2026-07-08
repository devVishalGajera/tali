/** Official Talli social profiles — single source for footer, store pages, etc. */

export const TALLI_SOCIAL = {
  instagram: "https://www.instagram.com/tallidrinks/",
  twitter: "https://x.com/tallidrinks",
  facebook: "https://www.facebook.com/Tallidelivery",
} as const;

export const TALLI_STORE_SOCIAL = {
  facebook: TALLI_SOCIAL.facebook,
  instagram: TALLI_SOCIAL.instagram,
  twitter: TALLI_SOCIAL.twitter,
  youtube: "",
};

export const TALLI_FOOTER_SOCIAL_LINKS = [
  { label: "Facebook", href: TALLI_SOCIAL.facebook },
  { label: "Instagram", href: TALLI_SOCIAL.instagram },
  { label: "Twitter", href: TALLI_SOCIAL.twitter },
] as const;
