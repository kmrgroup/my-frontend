interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    isTrust?: boolean;
    isCoinbaseWallet?: boolean;
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (event: string, handler: (...args: any[]) => void) => void;
    removeListener: (event: string, handler: (...args: any[]) => void) => void;
  };
}