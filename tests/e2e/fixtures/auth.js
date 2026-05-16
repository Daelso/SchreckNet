const { request } = require("@playwright/test");

const TEST_USER = {
  email: "testxp@test.com",
  password: "TestPass123!",
  // user_id 42 — must exist in the local DB
  // Activated via: UPDATE users SET activated=1 WHERE email='testxp@test.com'
  id: 42,
};

/**
 * Log in via the API and copy the resulting auth cookies onto the supplied
 * Playwright BrowserContext. SchreckNet's auth is httpOnly cookies, so this
 * is the simplest way to authenticate a test browser.
 */
async function loginAsTestxp(context) {
  const ctx = await request.newContext();
  const resp = await ctx.post("http://localhost:5000/user/login", {
    data: { email: TEST_USER.email, password: TEST_USER.password },
  });
  if (!resp.ok()) {
    throw new Error(
      `loginAsTestxp: API returned ${resp.status()} — ensure ${TEST_USER.email} exists and is activated in the local DB`
    );
  }
  const cookies = await ctx.storageState();
  await context.addCookies(cookies.cookies);
  await ctx.dispose();
}

module.exports = { loginAsTestxp, TEST_USER };
