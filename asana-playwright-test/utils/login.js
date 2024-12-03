const { test, expect } = require('@playwright/test');

// The login function to be reused
async function login(page) {
  // Navigate to the login page
  await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/');

  // Fill in the username
  await page.fill('//input[@id="username"]', 'admin');

  // Fill in the password
  await page.fill('//input[@id="password"]', 'password123');

  // Click the sign-in button
  await page.click('//button[@type="submit"]');

  // Wait for the "Web Application" element to be visible after login
  const webAppElement = await page.locator('//h1[contains(text(), "Web Application")]');
  await expect(webAppElement).toBeVisible(); // Verify that the element is visible, indicating login success
}
module.exports = { login };
// A test case to check the login functionality
test('Login to Demo App', async ({ page }) => {
  await login(page); // Call the login function
});
