export interface PasswordHashingAdapter {
  hash(plainPassword: string): string | Promise<string>;
}
