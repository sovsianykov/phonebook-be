export const config = {
  get adminEmail(): string {
    return process.env.ADMIN_EMAIL ?? '';
  },
};
