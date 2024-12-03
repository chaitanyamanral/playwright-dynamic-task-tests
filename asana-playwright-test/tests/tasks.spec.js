const { test, expect } = require('@playwright/test');
const fs = require('fs');
const { login } = require('../utils/login'); // Import the login function

// Read the test data from the JSON file
const testData = JSON.parse(fs.readFileSync('./data/testData.json'));

// Reusable function to verify tasks and tags
async function verifyTaskAndTags({ page, columnName, taskName, tags, appType }) {
  // Navigate to the correct application (Web or Mobile)
  const appButtonLocator = `//button[h2[contains(text(), "${appType}")]]`;
  const appButton = await page.locator(appButtonLocator);
  await appButton.click();
  console.log(`${appType} clicked`);

  // Locate the column
  const columnLocator = `//div[contains(@class, "flex flex-col w-80")]/h2[contains(text(), "${columnName}")]`;
  const columnElement = await page.locator(columnLocator);
  await expect(columnElement).toHaveText(new RegExp(columnName));
  console.log(`${columnName} column is present`);

  // Locate the task
  const taskLocator = `//div[contains(@class, "flex flex-col w-80")]//h3[contains(text(), "${taskName}")]`;
  const taskElement = await page.locator(taskLocator);
  await expect(taskElement).toBeVisible();
  console.log(`${taskName} is present in ${columnName}`);

  // Verify each tag
  for (const tag of tags) {
    const tagLocator = `${taskLocator}/following-sibling::div//span[contains(text(), "${tag.text}") and contains(@class, "${tag.bgClass}") and contains(@class, "${tag.textClass}")]`;
    
    // Wait explicitly for the tag to appear
    const tagElement = await page.locator(tagLocator);
    await tagElement.waitFor({ state: 'visible', timeout: 10000 }); // Added explicit wait with a longer timeout
    await expect(tagElement).toBeVisible();
    console.log(`${tag.text} tag is present`);
  }
}

test.describe('Dynamic Task Verification Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application URL
    await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/');

    // Perform login
    await login(page);
  });

  // Loop through the test cases from the JSON file and create a test for each case
  testData.testCases.forEach((testCase) => {
    test(testCase.name, async ({ page }) => {
      await verifyTaskAndTags({
        page,
        columnName: testCase.column,
        taskName: testCase.task,
        tags: testCase.tags.map(tag => ({
          text: tag,
          bgClass: tag === 'Bug' ? 'bg-red-100' : tag === 'Feature' ? 'bg-blue-100' : tag === 'High Priority' ? 'bg-orange-100' : 'bg-purple-100',
          textClass: tag === 'Bug' ? 'text-red-800' : tag === 'Feature' ? 'text-blue-800' : tag === 'High Priority' ? 'text-orange-800' : 'text-purple-800'
        })),
        appType: testCase.navigateTo,
      });
    });
  });
});
