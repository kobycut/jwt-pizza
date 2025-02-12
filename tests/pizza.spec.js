import { test, expect } from "playwright-test-coverage";

test("home page", async ({ page }) => {
  await page.goto("/");

  expect(await page.title()).toBe("JWT Pizza");
});

test("buy pizza with login", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(page.getByRole("heading")).toContainText("The web's best pizza");
  await page.getByRole("button", { name: "Order now" }).click();
  await expect(page.locator("h2")).toContainText("Awesome is a click away");
  await page.getByRole("combobox").selectOption("17");
  await page.getByRole("link", { name: "Image Description Veggie A" }).click();
  await page.getByRole("link", { name: "Image Description Margarita" }).click();
  await page.getByRole("link", { name: "Image Description Pepperoni" }).click();
  await page.getByRole("link", { name: "Image Description Crusty A" }).click();
  await page.getByRole("link", { name: "Image Description Charred" }).click();
  await expect(page.locator("form")).toContainText("Selected pizzas: 5");
  await page.getByRole("button", { name: "Checkout" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("main")).toContainText(
    "Send me those 5 pizzas right now!"
  );
  await expect(page.locator("tfoot")).toContainText("5 pies");
  await page.getByRole("button", { name: "Pay now" }).click();
  await expect(page.getByRole("heading")).toContainText(
    "Here is your JWT Pizza!"
  );
  await expect(page.getByRole("main")).toContainText("0.025 ₿");
  await page
    .locator("div")
    .filter({ hasText: "Here is your JWT Pizza!" })
    .nth(2)
    .click();
});

test("purchase with login", async ({ page }) => {
  await page.route("*/**/api/order/menu", async (route) => {
    const menuRes = [
      {
        id: 1,
        title: "Veggie",
        image: "pizza1.png",
        price: 0.0038,
        description: "A garden of delight",
      },
      {
        id: 2,
        title: "Pepperoni",
        image: "pizza2.png",
        price: 0.0042,
        description: "Spicy treat",
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: menuRes });
  });

  await page.route("*/**/api/franchise", async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: "LotaPizza",
        stores: [
          { id: 4, name: "Lehi" },
          { id: 5, name: "Springville" },
          { id: 6, name: "American Fork" },
        ],
      },
      { id: 3, name: "PizzaCorp", stores: [{ id: 7, name: "Spanish Fork" }] },
      { id: 4, name: "topSpot", stores: [] },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });

  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "d@jwt.com", password: "a" };
    const loginRes = {
      user: {
        id: 3,
        name: "Kai Chen",
        email: "d@jwt.com",
        roles: [{ role: "diner" }],
      },
      token: "abcdef",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route("*/**/api/order", async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: "Veggie", price: 0.0038 },
        { menuId: 2, description: "Pepperoni", price: 0.0042 },
      ],
      storeId: "4",
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: "Veggie", price: 0.0038 },
          { menuId: 2, description: "Pepperoni", price: 0.0042 },
        ],
        storeId: "4",
        franchiseId: 2,
        id: 23,
      },
      jwt: "eyJpYXQ",
    };
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto("/");

  // Go to order page
  await page.getByRole("button", { name: "Order now" }).click();

  // Create order
  await expect(page.locator("h2")).toContainText("Awesome is a click away");
  await page.getByRole("combobox").selectOption("4");
  await page.getByRole("link", { name: "Image Description Veggie A" }).click();
  await page.getByRole("link", { name: "Image Description Pepperoni" }).click();
  await expect(page.locator("form")).toContainText("Selected pizzas: 2");
  await page.getByRole("button", { name: "Checkout" }).click();

  // Login
  await page.getByPlaceholder("Email address").click();
  await page.getByPlaceholder("Email address").fill("d@jwt.com");
  await page.getByPlaceholder("Email address").press("Tab");
  await page.getByPlaceholder("Password").fill("a");
  await page.getByRole("button", { name: "Login" }).click();

  // Pay
  await expect(page.getByRole("main")).toContainText(
    "Send me those 2 pizzas right now!"
  );
  await expect(page.locator("tbody")).toContainText("Veggie");
  await expect(page.locator("tbody")).toContainText("Pepperoni");
  await expect(page.locator("tfoot")).toContainText("0.008 ₿");
  await page.getByRole("button", { name: "Pay now" }).click();

  // Check balance
  await expect(page.getByText("0.008")).toBeVisible();
});

test("register", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(page.getByRole("heading")).toContainText("The web's best pizza");
  await page.getByRole("link", { name: "Register" }).click();
  await expect(page.getByRole("heading")).toContainText("Welcome to the party");
  await page.getByRole("textbox", { name: "Full name" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("new_user");
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("new_user@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("new_user");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page.getByRole("heading")).toContainText("The web's best pizza");
  await page.getByRole("link", { name: "Logout" }).click();
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("new_user@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("new_user");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByLabel("Global")).toContainText("n");
  await page.getByRole("link", { name: "Logout" }).click();
});

test("open links", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "About" }).click();
  await expect(page.getByRole("main")).toContainText(
    "At JWT Pizza, our amazing employees are the secret behind our delicious pizzas. They are passionate about their craft and spend every waking moment dreaming about how to make our pizzas even better. From selecting the finest ingredients to perfecting the dough and sauce recipes, our employees go above and beyond to ensure the highest quality and taste in every bite. Their dedication and attention to detail make all the difference in creating a truly exceptional pizza experience for our customers. We take pride in our team and their commitment to delivering the best pizza in town."
  );
  await expect(page.getByRole("main")).toContainText("The secret sauce");
  await expect(page.getByRole("main")).toContainText(
    "JWT Pizza is home to a team of pizza enthusiasts who are truly passionate about their craft. They are constantly experimenting with new flavors, techniques, and ingredients to push the boundaries of traditional pizza-making. Their relentless pursuit of perfection is evident in every bite, as they strive to create a pizza experience that is unparalleled. Our employees understand that the secret to a great pizza lies in the details, and they leave no stone unturned in their quest for pizza perfection. We are proud to have such dedicated individuals on our team, as they are the driving force behind our reputation for exceptional quality and taste."
  );
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Franchise" })
    .click();
  await expect(page.getByRole("main")).toContainText(
    "So you want a piece of the pie?"
  );
  await expect(page.getByRole("main")).toContainText("Call now800-555-5555");
  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByRole("heading")).toContainText("Mama Rucci, my my");
  await expect(page.getByRole("main")).toContainText(
    'Pizza has a long and rich history that dates back thousands of years. Its origins can be traced back to ancient civilizations such as the Egyptians, Greeks, and Romans. The ancient Egyptians were known to bake flatbreads topped with various ingredients, similar to modern-day pizza. In ancient Greece, they had a dish called "plakous" which consisted of flatbread topped with olive oil, herbs, and cheese.'
  );
});

test("diner", async ({ page }) => {await page.goto('http://localhost:5173/');
await page.getByRole('link', { name: 'Login' }).click();
await page.getByRole('textbox', { name: 'Email address' }).click();
await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
await page.getByRole('textbox', { name: 'Password' }).fill('diner');
await page.getByRole('button', { name: 'Login' }).click();
await page.getByRole('link', { name: 'pd' }).click();
await expect(page.locator('tbody')).toContainText('55');
await expect(page.locator('tbody')).toContainText('2025-02-12T20:17:42.000Z');
await expect(page.getByRole('heading')).toContainText('Your pizza kitchen');
await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
await page.getByRole('link', { name: 'Order' }).click();
await page.getByRole('link', { name: 'Logout' }).click();})

test("admin", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("textbox", { name: "Password" }).press("Enter");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await expect(page.locator("#navbar-dark")).toContainText("Admin");
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).click();
  await page
    .getByRole("textbox", { name: "franchise name" })
    .fill("super cool franchise");
  await page.getByRole("textbox", { name: "franchisee admin email" }).click();
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill("f@jwt.com");
  await expect(page.getByRole("heading")).toContainText("Create franchise");
  await expect(page.locator("form")).toContainText("Want to create franchise?");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("table")).toContainText("super cool franchise");
  await page
    .getByRole("row", { name: "super cool franchise pizza" })
    .getByRole("button")
    .click();
  await expect(page.getByRole("heading")).toContainText("Sorry to see you go");
  await page.getByRole("button", { name: "Close" }).click();
});


