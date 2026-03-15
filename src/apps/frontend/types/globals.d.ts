export {};

declare global {
  const Config: {
    env: string;
  };

  interface Window {
    Config: typeof Config;
  }
}
