import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});

test('buy pizza with login', async ({ page }) => {await page.goto('http://localhost:5173/');
await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
await page.getByRole('button', { name: 'Order now' }).click();
await expect(page.locator('h2')).toContainText('Awesome is a click away');
await page.getByRole('combobox').selectOption('17');
await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
await page.getByRole('link', { name: 'Image Description Margarita' }).click();
await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
await page.getByRole('link', { name: 'Image Description Crusty A' }).click();
await page.getByRole('link', { name: 'Image Description Charred' }).click();
await expect(page.locator('form')).toContainText('Selected pizzas: 5');
await page.getByRole('button', { name: 'Checkout' }).click();
await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
await page.getByRole('textbox', { name: 'Password' }).click();
await page.getByRole('textbox', { name: 'Password' }).fill('diner');
await page.getByRole('button', { name: 'Login' }).click();
await expect(page.getByRole('main')).toContainText('Send me those 5 pizzas right now!');
await expect(page.locator('tfoot')).toContainText('5 pies');
await page.getByRole('button', { name: 'Pay now' }).click();
await expect(page.getByRole('heading')).toContainText('Here is your JWT Pizza!');
await expect(page.getByRole('main')).toContainText('0.025 ₿');
await page.locator('div').filter({ hasText: 'Here is your JWT Pizza!' }).nth(2).click();});