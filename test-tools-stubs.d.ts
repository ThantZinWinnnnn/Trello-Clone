declare module "vitest" {
  export const describe: any;
  export const it: any;
  export const expect: any;
  export const beforeEach: any;
  export const afterEach: any;
  export const vi: any;
}

declare module "vitest/config" {
  export const defineConfig: any;
}

declare module "@playwright/test" {
  export const test: any;
  export const expect: any;
  export const defineConfig: any;
}
