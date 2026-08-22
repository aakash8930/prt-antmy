/**
 * ISOLATED CONFIGURATION — contact destinations.
 *
 * Only verified information is populated. The email address is the primary
 * contact action; the GitHub profile is the secondary reference destination.
 */
export type ContactInfo = {
  /** Direct email address — renders a mailto: link when set. */
  email?: string;
  /** Verified public profile. */
  github?: string;
};

export const CONTACT: ContactInfo = {
  email: "aakash.singh0953@gmail.com",
  github: "https://github.com/aakash8930",
};
