declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_ACCESS_TOKEN: string;
      JWT_SECRET: string;
    }
  }
}

export {};
