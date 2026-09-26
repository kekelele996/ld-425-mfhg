export const jwtConfig = {
  secret: process.env.JWT_SECRET ?? 'local-secret',
  expiresIn: '8h'
};
