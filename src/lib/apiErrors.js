// Turns an axios error into a sentence a player can act on.

export const NETWORK_MESSAGE =
  "Couldn't reach SchreckNet. Check your connection and try again.";
export const SESSION_MESSAGE = "Your session has expired. Log in to continue.";
export const RATE_LIMIT_MESSAGE =
  "Too many requests. Wait a few minutes and try again.";
export const SERVER_MESSAGE =
  "Something went wrong on our side. Try again in a moment.";
export const GENERIC_MESSAGE = "That didn't work. Try again in a moment.";

// Bare status texts the API sends that mean nothing to a player.
const GENERIC_SERVER_TEXTS = [
  "access denied",
  "forbidden",
  "unauthorized",
  "not found",
  "not found!",
  "bad request",
  "invalid refresh token!",
  "server error",
  "internal server error",
];

function serverText(err) {
  const data = err && err.response ? err.response.data : undefined;
  if (typeof data === "string") return data.trim();
  if (data && typeof data.message === "string") return data.message.trim();
  return "";
}

// Short, plain text that isn't HTML or a bare status word.
function isHumanText(text) {
  return (
    text.length > 0 &&
    text.length <= 200 &&
    !/[<>{}]/.test(text) &&
    !GENERIC_SERVER_TEXTS.includes(text.toLowerCase())
  );
}

export function apiStatus(err) {
  return err && err.response ? err.response.status : undefined;
}

// 401, or a 403 without a more specific explanation from the server
// (e.g. "Activate your account..." is a 403 that logging in won't fix).
export function isSessionError(err) {
  const status = apiStatus(err);
  if (status === 401) return true;
  return status === 403 && !isHumanText(serverText(err));
}

export function apiErrorMessage(err) {
  if (!err || !err.response) return NETWORK_MESSAGE;

  const status = err.response.status;
  const text = serverText(err);

  if (status === 429)
    return text && isHumanText(text) ? text : RATE_LIMIT_MESSAGE;
  if (status >= 500) return SERVER_MESSAGE;
  if (isSessionError(err)) return SESSION_MESSAGE;
  if (isHumanText(text)) return text;
  return GENERIC_MESSAGE;
}

export function notifyApiError($q, err, message) {
  $q.notify({
    color: "red-5",
    textColor: "white",
    icon: "warning",
    message: message || apiErrorMessage(err),
  });
}
