declare global {
  interface String {
    isMarkdown(): boolean;
    capitalize(): string;
    isEmail(): boolean;
  }
}

export { };
