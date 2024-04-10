import { createSafeActionClient } from "next-safe-action";

export const action = createSafeActionClient({
  // You can provide a custom log Promise, otherwise the lib will use `console.error`
  // as the default logging system. If you want to disable server errors logging,
  // just pass an empty Promise.
  handleServerErrorLog: (e) => {
    console.error("CUSTOM ERROR LOG FUNCTION:", e);
  },
});
