// Runs in the Node.js process before any route code.
// Node 22 exposes a partial `localStorage` global via --localstorage-file;
// when the file path is missing/invalid the object exists but getItem() throws.
// Framer Motion trusts the global and crashes during SSR.
// This replaces it with a safe in-memory implementation.
export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    (typeof globalThis.localStorage === "undefined" ||
      typeof (globalThis.localStorage as Storage).getItem !== "function")
  ) {
    const store: Record<string, string> = {};
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { Object.keys(store).forEach(k => delete store[k]); },
        get length() { return Object.keys(store).length; },
        key: (n: number) => Object.keys(store)[n] ?? null,
      } satisfies Storage,
      writable: true,
      configurable: true,
    });
  }
}
