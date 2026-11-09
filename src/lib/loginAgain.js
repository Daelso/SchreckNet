import LoginDialog from "components/registry/LoginDialog.vue";

// Passed to a save handler to mark the one automatic retry after logging in.
export const RETRY_AFTER_LOGIN = Symbol("retryAfterLogin");

// Opens the login dialog over the current page. Resolves true once the user
// has logged in, false if they cancel. The page underneath stays mounted.
export function promptLogin($q, componentProps = {}) {
  return new Promise((resolve) => {
    $q.dialog({ component: LoginDialog, componentProps })
      .onOk(() => resolve(true))
      .onCancel(() => resolve(false));
  });
}
