declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_ACCESS_TOKEN: string;
    }
  }
}

export {};
