const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Links tests', () => {
  test('index.html should have correct GitHub and Website links', async ({ page }) => {
    // Construct the file URL for index.html
    const filePath = path.resolve(__dirname, '../index.html');
    const fileUrl = `file://${filePath}`;

    // Go to the local HTML file
    await page.goto(fileUrl);

    // Locate the GitHub link by text content
    const githubLink = page.locator('a:has-text("صفحه‌ی گیت‌هاب من")');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/Noormohammadiazad/');

    // Locate the Website link by text content
    const websiteLink = page.locator('a:has-text("وب‌سایت من")');
    await expect(websiteLink).toBeVisible();
    await expect(websiteLink).toHaveAttribute('href', 'https://mohammadali.org');
  });
});
