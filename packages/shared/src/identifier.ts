export function generateUUID(): string {
  return self.crypto.randomUUID();
}
