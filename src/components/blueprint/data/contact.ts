/**
 * ISOLATED CONFIGURATION — contact destinations.
 *
 * Only verified information is populated. The GitHub identity is verified
 * from the repository itself (remote github.com/aakash8930/prt-antmy.git).
 * No email, phone or other channel exists in the repository, so `email` is
 * left unset — when a real address is added here, the Contact section will
 * render it as the primary mailto: action with no other changes needed.
 */
export type ContactInfo = {
  /** Direct email address — renders a mailto: link when set. */
  email?: string;
  /** Verified public profile. */
  github?: string;
};

export const CONTACT: ContactInfo = {
  github: "https://github.com/aakash8930",
};
