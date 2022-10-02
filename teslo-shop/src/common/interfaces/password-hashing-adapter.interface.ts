export interface PasswordHashingAdapter {
  hash(plainPassword: string): string | Promise<string>;
  compare(
    plainPassword: string,
    hashedPassword: string,
  ): boolean | Promise<boolean>;
}
