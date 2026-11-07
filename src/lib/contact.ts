export const MAX_MESSAGE_LENGTH = 1000;

type ContactMessage = { name: string; email: string; message: string };

/** A mailto link that opens the visitor's email app with the message filled in. */
export function buildContactMailto(to: string, { name, email, message }: ContactMessage): string {
  const subject = `Portfolio message from ${name}`;
  const body = `${message}\n\n${name}\n${email}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
