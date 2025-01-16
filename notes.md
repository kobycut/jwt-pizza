# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      | home.tsx           |    none           |   none       |
| Register new user<br/>(t@jwt.com, pw: test)         | register.tsx       | [POST] /api/auth  |  INSERT INTO user (name, email, password) VALUES (?, ?, ?)         |
| Login new user<br/>(t@jwt.com, pw: test)            | login.tsx          |   [PUT] /api/auth |   INSERT INTO auth (token, userId) VALUES (?, ?)           |
| Order pizza                                         |  menu.tsx          |  [GET] /api/order |  SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=?        |
| Verify pizza                                        | delivery.tsx       |[POST] /api/order/verify|SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=?              | 
| View profile page                                   |  dinerDashboard.tsx| [GET] /api/order  |  SELECT id, menuId, description, price FROM orderItem WHERE orderId=?  |
| View franchise<br/>(as diner)                       | franchiseDashboard.tsx | /api/franchise/${user.id}                 | SELECT id, name FROM franchise             |
| Logout                                              |  logout.tsx        | [DELETE] /api/auth| DELETE FROM auth WHERE token=?|
| View About page                                     | about.tsx          |   none            | none         |
| View History page                                   | history.tsx        |   none            |  none        |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) | login.tsx          | [PUT] /api/auth   | SELECT id, name FROM franchise WHERE id in (${franchiseIds.join(',')})           |
| View franchise<br/>(as franchisee)                  | franchiseDashboard.tsx | /api/franchise/${user.id} | SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee'`, [franchise.id]             |
| Create a store                                      |  franchiseDashboard.tsx | [POST] /api/franchise  | INSERT INTO store (franchiseId, name) VALUES (?, ?)`, [franchiseId, store.name]             |
| Close a store                                       | closeStore.tsx     |  [DELETE] /api/ franchise/${franchise.id}                |  DELETE FROM store WHERE franchiseId=? AND id=?`, [franchiseId, storeId]              |
| Login as admin<br/>(a@jwt.com, pw: admin)           |  login.tsx         | [PUT] /api/auth   |  SELECT id, name FROM franchise WHERE id in (${franchiseIds.join(',')})            |
| View Admin page                                     | adminDashboard.tsx | /api/franchise    | SELECT id, name FROM store WHERE franchiseId=?`, [franchise.id]             |
| Create a franchise for t@jwt.com                    | createFranchise.tsx| [POST] /api/franchise | INSERT INTO store (franchiseId, name) VALUES (?, ?)`, [franchiseId, store.name]             |
| Close the franchise for t@jwt.com                   | closeFranchise.tsx | [DELETE] /api/franchise/${franchise.id} | DELETE FROM store WHERE franchiseId=? AND id=?`, [franchiseId, storeId]             |
