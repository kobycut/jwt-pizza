import { test, expect } from "playwright-test-coverage";

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

test("diner dashboard", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Login" }).click();
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await page.getByRole("link", { name: "Order" }).click();
  await page.getByRole("link", { name: "pd" }).click();
  await expect(page.getByRole("main")).toContainText("pizza diner");
  await page.getByRole("link", { name: "Logout" }).click();
});

// test("franchise test", async ({ page }) => {
//   await page.route("*/**/api/auth", async (route) => {
//     const franchiseReq = {
//       email: "f@jwt.com",
//       password: "franchisee",
//     };
//     const franchiseRes = {
//       user: {
//         id: 3,
//         name: "pizza franchisee",
//         email: "f@jwt.com",
//         roles: [
//           {
//             role: "diner",
//           },
//           {
//             objectId: 1,
//             role: "franchisee",
//           },
//         ],
//       },
//       token:
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InBpenphIGZyYW5jaGlzZWUiLCJlbWFpbCI6ImZAand0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifSx7Im9iamVjdElkIjoxLCJyb2xlIjoiZnJhbmNoaXNlZSJ9XSwiaWF0IjoxNzM5NTg4NzQyfQ.YZgoesC5g_s_c_QvzHxUD2hM4Ll4PyxJFk1GkXUDmhc",
//     };
//     expect(route.request().method()).toBe("PUT");
//     expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
//     await route.fulfill({ json: franchiseRes });
//   });

//   await page.route("*/**/api/franchise/3", async (route) => {
//     const franchiseRes = [
//       {
//         id: 1,
//         name: "pizzaPocket",
//         admins: [
//           {
//             id: 3,
//             name: "pizza franchisee",
//             email: "f@jwt.com",
//           },
//         ],
//         stores: [
//           {
//             id: 1,
//             name: "SLC",
//             totalRevenue: 0.3849,
//           },
//           {
//             id: 11,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//           {
//             id: 13,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//           {
//             id: 33,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//           {
//             id: 34,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//           {
//             id: 35,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//           {
//             id: 36,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//           {
//             id: 37,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//         ],
//       },
//     ];
//     expect(route.request().method()).toBe("GET");
//     await route.fulfill({ json: franchiseRes });
//   });

//   await page.route("*/**/api/franchise/1/store", async (route) => {
//     const franchiseReq = {
//       id: "",
//       name: "kobys store",
//     };
//     const franshiseRes = {
//       id: 38,
//       franchiseId: 1,
//       name: "kobys store",
//     };
//     expect(route.request().method()).toBe("POST");
//     expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
//     await route.fulfill({ json: franshiseRes });
//   });

//   await page.route("*/**/api/franchise/3", async (route) => {
//     const franchiseRes = [
//       {
//         id: 1,
//         name: "pizzaPocket",
//         admins: [
//           {
//             id: 3,
//             name: "pizza franchisee",
//             email: "f@jwt.com",
//           },
//         ],
//         stores: [
//           {
//             id: 1,
//             name: "SLC",
//             totalRevenue: 0.3849,
//           },
//           {
//             id: 11,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//           {
//             id: 13,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//           {
//             id: 33,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//           {
//             id: 34,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//           {
//             id: 35,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//           {
//             id: 36,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//           {
//             id: 37,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//           {
//             id: 38,
//             name: "kobys store",
//             totalRevenue: 0,
//           },
//         ],
//       },
//     ];
//     expect(route.request().method()).toBe("GET");
//     await route.fulfill({ json: franchiseRes });
//   });

//   await page.route("*/**/api/franchise/1/store/33", async (route) => {
//     const franchiseRes = {
//       message: "store deleted",
//     };
//     expect(route.request().method()).toBe("DELETE");
//     await route.fulfill({ json: franchiseRes });
//   });

//   await page.goto("http://localhost:5173/");
//   await page.getByRole("link", { name: "Login" }).click();
//   await page.getByRole("textbox", { name: "Email address" }).fill("f@jwt.com");
//   await page.getByRole("textbox", { name: "Email address" }).press("Tab");
//   await page.getByRole("textbox", { name: "Password" }).fill("franchisee");
//   await page.getByRole("button", { name: "Login" }).click();
//   await expect(page.locator("#navbar-dark")).toContainText("Franchise");
//   await page
//     .getByLabel("Global")
//     .getByRole("link", { name: "Franchise" })
//     .click();
//   await page
//     .getByLabel("Global")
//     .getByRole("link", { name: "Franchise" })
//     .click();
//   await page
//     .getByLabel("Global")
//     .getByRole("link", { name: "Franchise" })
//     .click();
//   await page.getByRole("button", { name: "Create store" }).click();
//   await page.getByRole("textbox", { name: "store name" }).click();
//   await page.getByRole("textbox", { name: "store name" }).fill("kobys store");
//   await page.getByRole("button", { name: "Create" }).click();
//   await page.getByRole("button", { name: "Close" }).nth(3).click();
//   await page.getByRole("button", { name: "Close" }).click();
// });

// test("register test", async ({ page }) => {
//   await page.route("*/**/api/auth", async (route) => {
//     const registerReq = {
//       name: "newUser",
//       email: "user@jwt.com",
//       password: "user",
//     };
//     const registerRes = {
//       user: {
//         name: "newUser",
//         email: "user@jwt.com",
//         roles: [
//           {
//             role: "diner",
//           },
//         ],
//         id: 47,
//       },
//       token:
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmV3VXNlciIsImVtYWlsIjoidXNlckBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJkaW5lciJ9XSwiaWQiOjQ3LCJpYXQiOjE3Mzk1OTAyMDF9.5-YdOMkbgV_u1R84ztOBlcaRenlgM5nGraMPgxWCkrA",
//     };
//     expect(route.request().method()).toBe("POST");
//     expect(route.request().postDataJSON()).toMatchObject(registerReq);
//     await route.fulfill({ json: registerRes });
//   });

//   await page.route("*/**/api/franchise/47", async (route) => {
//     const registerRes = [];
//     expect(route.request().method()).toBe("GET");
//     await route.fulfill({ json: registerRes });
//   });

//   await page.goto("http://localhost:5173/");
//   await page.getByRole("link", { name: "Register" }).click();
//   await page.getByRole("textbox", { name: "Full name" }).fill("newUser");
//   await page.getByRole("textbox", { name: "Full name" }).press("Tab");
//   await page.getByRole("textbox", { name: "Email address" }).fill("user");
//   await page.getByRole("textbox", { name: "Email address" }).press("Tab");
//   await page.getByRole("textbox", { name: "Password" }).fill("user");
//   await page.getByRole("button", { name: "Register" }).click();
//   await page
//     .getByRole("textbox", { name: "Email address" })
//     .fill("user@jwt.com");
//   await page.getByRole("button", { name: "Register" }).click();
//   await page.getByRole("link", { name: "About" }).click();
//   await page.getByRole("link", { name: "History" }).click();
//   await page
//     .getByRole("contentinfo")
//     .getByRole("link", { name: "Franchise" })
//     .click();
// });

// test("admin test", async ({ page }) => {
//   await page.goto("http://localhost:5173/");
//   await page.getByRole("link", { name: "Login" }).click();
//   await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
//   await page.getByRole("textbox", { name: "Email address" }).press("Tab");
//   await page.getByRole("textbox", { name: "Password" }).fill("admin");
//   await page.getByRole("textbox", { name: "Password" }).press("Enter");
//   await page.getByRole("button", { name: "Login" }).click();
//   await page.getByRole("link", { name: "Admin" }).click();
//   await page.getByRole("button", { name: "Add Franchise" }).click();
//   await page.getByRole("textbox", { name: "franchise name" }).click();
//   await page
//     .getByRole("textbox", { name: "franchise name" })
//     .fill("hello world2");
//   await page.getByRole("textbox", { name: "franchisee admin email" }).click();
//   await page
//     .getByRole("textbox", { name: "franchisee admin email" })
//     .fill("f@jwt.com");
//   await page.getByRole("button", { name: "Create" }).click();
// });

// test('Create a franchise', async ({ page }) => {
//   await page.route('*/**/api/auth', async (route) => {
//     const loginReq = { email: 'a@jwt.com', password: 'admin' };
//     const loginRes = { user: { id: 3, name: 'Kyle', email: 'a@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
//     expect(route.request().method()).toBe('PUT');
//     expect(route.request().postDataJSON()).toMatchObject(loginReq);
//     await route.fulfill({ json: loginRes });
//   });

//   await page.route('*/**/api/franchise', async (route) => {
//     const franchiseRes = [
//       {
//         id: 2,
//         name: 'LotaPizza',
//         stores: [
//           { id: 4, name: 'Lehi' }
//         ],
//       },
//       { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
//       { id: 4, name: 'TestFranchise', stores: [] },
//     ];
//     if(route.request().method() === 'POST') {
//       await route.fulfill({ json: {
//         "stores": [],
//         "id": 3,
//         "name": "Hello World",
//         "admins": [
//             {
//                 "email": "f@jwt.com",
//                 "id": 3,
//                 "name": "franchisee"
//             }
//         ]
//       }});
//     } else if (route.request().method() === 'GET') {
//       await route.fulfill({ json: franchiseRes });
//     }
//   });
//   await page.goto('/');
//   await page.getByRole('link', { name: 'Login' }).click();
//   await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');

//   await page.getByRole('textbox', { name: 'Password' }).fill('admin');
//   await page.getByRole('button', { name: 'Login' }).click();


//   await page.getByRole('link', { name: 'Admin' }).click();
//   await page.getByRole('button', { name: 'Add Franchise' }).click();
//   await expect(page.getByRole('heading')).toContainText('Create franchise');
//   await page.getByRole('textbox', { name: 'franchise name' }).fill('TestFranchise');
//   await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('f@jwt.com');
//   await page.getByRole('button', { name: 'Create' }).click();

//   await expect(page.getByRole('table')).toContainText('TestFranchise');
// });
