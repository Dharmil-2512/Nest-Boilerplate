declare global {
  namespace NodeJS {
    interface IProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: string;
    }
  }
}
export {};
