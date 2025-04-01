import { sleep, check, group, fail } from "k6";
import http from "k6/http";

export const options = {
  cloud: {
    distribution: {
      "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 },
    },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: "ramping-vus",
      gracefulStop: "30s",
      stages: [
        { target: 5, duration: "30s" },
        { target: 15, duration: "1m" },
        { target: 10, duration: "30s" },
        { target: 0, duration: "30s" },
      ],
      gracefulRampDown: "30s",
      exec: "scenario_1",
    },
  },
};

export function scenario_1() {
  let response;
  const vars = {};
  let loginOptions = [
    '{"email":"a@jwt.com","password":"admin"}',
    '{"email":"d@jwt.com","password":"diner"}',
    '{"email":"f@jwt.com","password":"franchisee"}',
  ];

  group("Login and order - https://pizza.kobycut.click/", function () {
    // Login
    response = http.put(
      "https://pizza-service.kobycut.click/api/auth",
      loginOptions[Math.floor(Math.random() * 3)],
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7",
          "content-type": "application/json",
          origin: "https://pizza.kobycut.click",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
      }
    );
    if (
      !check(response, {
        "status equals 200": (response) => response.status.toString() === "200",
      })
    ) {
      console.log(response.body);
      fail("Login was *not* 200");
    }
    vars.authToken = response.json().token;
    sleep(10);

    // Get menu
    response = http.get("https://pizza-service.kobycut.click/api/order/menu", {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7",
        "content-type": "application/json",
        authorization: `Bearer ${vars.authToken}`,
        origin: "https://pizza.kobycut.click",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
    });

    // Get franchise
    response = http.get("https://pizza-service.kobycut.click/api/franchise", {
      headers: {
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7",
        "content-type": "application/json",
        authorization: `Bearer ${vars.authToken}`,
        origin: "https://pizza.kobycut.click",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
      },
    });
    sleep(12);

    // Purchase pizza
    response = http.post(
      "https://pizza-service.kobycut.click/api/order",
      '{"items":[{"menuId":1,"description":"Veggie","price":0.0038}],"storeId":"1","franchiseId":2}',
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7",
          "content-type": "application/json",
          authorization: `Bearer ${vars.authToken}`,
          origin: "https://pizza.kobycut.click",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
      }
    );
    vars.jwtToken = response.json().jwtToken;
    sleep(4);

    // Verify Pizza
    response = http.post(
      "https://pizza-factory.cs329.click/api/order/verify",
      // '{"jwt":"eyJpYXQiOjE3NDM0NzU0MTYsImV4cCI6MTc0MzU2MTgxNiwiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6IjE0bk5YT21jaWt6emlWZWNIcWE1UmMzOENPM1BVSmJuT2MzazJJdEtDZlEifQ.eyJ2ZW5kb3IiOnsiaWQiOiJrb2J5Y3V0IiwibmFtZSI6IktvYnkgQ3V0bGVyIn0sImRpbmVyIjp7ImlkIjoxLCJuYW1lIjoi5bi455So5ZCN5a2XIiwiZW1haWwiOiJhQGp3dC5jb20ifSwib3JkZXIiOnsiaXRlbXMiOlt7Im1lbnVJZCI6MSwiZGVzY3JpcHRpb24iOiJWZWdnaWUiLCJwcmljZSI6MC4wMDM4fV0sInN0b3JlSWQiOiIxIiwiZnJhbmNoaXNlSWQiOjIsImlkIjoyM319.T3jrLHh_O3PS25Sif6MHU9y375vnYbQx8LRaxQvbo4MxN6nC1QHuUlvU-hiab-cFGatnGfKrPg1HJZgQ2QthCVufnfz-iuxr3meguGGwLHyzyAil6_vuAwevy59p4SiKbhES5x8rnP3X7P114PE5h_e5e4tJiC6IXRka40TMmzlXjya4uoS4qZM5pWYZ7V5Y6-4J86wx8Rl3uQGNN8OscifP5qUqHhBS2Uw_8aUgy1P2Uklm3N-tnDXJCjYdjwitIOqQmRq9zgBXFaD9k9_ufUwAL12x-fEpnYHzzaFduJTDYkfBNlDv5LQdf5m-P_uT5Il5XGOk5TVHJb2Y0HMaQPXgzi4IfPQ2m-1y6w_Nc7n0Yxn7qM34s7EFXKrrDejYS71HYdtgcwuoKmgO4QNe_gMh_tMqjGLNlkFw5NS34QZK4MYtJ-QSxf2fwv03Up6bGO-O8X0yItNmiMlx3s1paUYz4gwXRaYYNJ2NzhaKN6BJ2Scw44PHeTBrA-2hbwHlQYzkn85YDz5CnHCW3Rnkh0E3sZAZkTru2xxqyyFn86aDQGTC-kHsGjbNJK3GkG_IigBbFqERyucuU5T0yzUR8puzDlQ2Q_rUdTZMbrNMrQz_wIJ92LHmLH3BLRz2qnpWaJg_el2-1ahTtei-lINY3JAM-js42K5wWB5IOxq1hBc"}',
      `{"jwt":${vars.jwtToken}}`,
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7",
          "content-type": "application/json",
          authorization: `Bearer ${vars.authToken}`,
          origin: "https://pizza.kobycut.click",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "sec-fetch-storage-access": "active",
        },
      }
    );
  });
}
