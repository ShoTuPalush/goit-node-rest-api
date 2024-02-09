export const config = {
  jwt: {
    access: { type: 'access', expiresIn: '15m' },
    refresh: { type: 'refresh', expiresIn: '30m' },
  },
};
