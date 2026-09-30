# PRODUCTS BACKEND API

A Node.js + Express + MongoDB backend project for managing users and products.

The project currently supports:

* User registration
* User login
* Password hashing with bcrypt
* JWT authentication
* Role-based authorization
* Product CRUD
* Image upload
* User ownership protection
* Admin product management
* Admin user management
* Global error handling
* Async error handling
* MongoDB validation

# TECHNOLOGIES

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Token)
* bcrypt
* Multer
* dotenv
* CORS
* Postman

# PROJECT STRUCTURE

Backend/
|
├── src/
│   ├── app.js
│   |
│   ├── config/
│   │   └── db.js
│   |
│   ├── models/
│   │   ├── product.model.js
│   │   └── user.model.js
│   |
│   ├── routes/
│   │   ├── product.routes.js
│   │   └── user.routes.js
│   |
│   ├── controllers/
│   │   ├── product.controller.js
│   │   └── user.controller.js
│   |
│   ├── services/
│   │   └── upload.service.js
│   |
│   └── middleware/
│       ├── auth.middleware.js
│       ├── admin.middleware.js
│       ├── productOwner.middleware.js
│       ├── findProduct.middleware.js
│       ├── findUser.middleware.js
│       ├── asyncHandler.js
│       └── error.middleware.js
|
├── server.js
├── .env
├── .gitignore
└── package.json

# ENVIRONMENT VARIABLES

.env

PORT=3001

MONGO_URI=mongodb://127.0.0.1:27017/ProjectProductCRUD

JWT_SECRET=my_super_secret_key_123

## IMPORTANT:

.env should NOT be committed to Git.

Add this to .gitignore:

node_modules/
.env

# SERVER STARTUP

server.js is responsible for:

1. Loading environment variables
2. Connecting to MongoDB
3. Starting Express server

Flow:

server.js
|
├── dotenv
|
├── connectDB()
|
└── app.listen()

# DATABASE CONNECTION

File:

src/config/db.js

Mongoose connects to MongoDB using:

process.env.MONGO_URI

If MongoDB connection fails, the application exits.

# APP.JS

File:

src/app.js

Main responsibilities:

* Create Express app
* Enable CORS
* Enable JSON body parsing
* Register routes
* Register global error middleware

Important:

Error middleware must be registered AFTER the routes.

Example:

app.use("/", productRoutes);
app.use("/", userRoutes);

app.use(errorMiddleware);

# USER MODEL

File:

src/models/user.model.js

User fields:

name
email
password
role
createdAt
updatedAt

Role values:

"user"
"admin"

Default role:

"user"

## Important:

Users cannot select "admin" during normal registration.

Registration only accepts:

name
email
password

The role is automatically:

"user"

# PASSWORD HASHING

Passwords are never stored as plain text.

During registration:

password
|
↓
bcrypt.hash(password, 10)
|
↓
hashed password
|
↓
MongoDB

# LOGIN

During login:

email
password
|
↓
Find user
|
↓
bcrypt.compare()
|
↓
Password correct?
|
↓
JWT generated

# JWT

JWT contains:

{
userId: user._id,
role: user.role
}

JWT is generated during login.

Example:

jwt.sign(
{
userId: user._id,
role: user.role
},
process.env.JWT_SECRET,
{
expiresIn: "1d"
}
)

# AUTHENTICATION

File:

src/middleware/auth.middleware.js

Protected request flow:

Client
|
↓
Authorization: Bearer TOKEN
|
↓
authMiddleware
|
↓
jwt.verify()
|
↓
req.user = decoded
|
↓
next()

After authentication:

req.user contains JWT data.

Example:

req.user.userId
req.user.role

# POSTMAN AUTHORIZATION

For protected routes:

Postman
→ Authorization
→ Type: Bearer Token
→ Paste JWT token

Do NOT manually write:

Bearer eyJ...

Postman automatically creates:

Authorization: Bearer eyJ...

# ADMIN AUTHORIZATION

File:

src/middleware/admin.middleware.js

adminMiddleware checks:

req.user.role

If role is not:

"admin"

response:

403

{
"message": "Admin access required"
}

Admin flow:

authMiddleware
↓
adminMiddleware
↓
controller

## IMPORTANT:

authMiddleware must run BEFORE adminMiddleware.

adminMiddleware depends on:

req.user

# PRODUCT MODEL

File:

src/models/product.model.js

Fields:

userId
image
name
desc
price

userId:

type: ObjectId
ref: "user"

This connects a product to its owner.

Example:

User A
|
├── Product 1
├── Product 2
└── Product 3

# CREATE PRODUCT

Endpoint:

POST /create-product

Middleware flow:

authMiddleware
↓
upload.single("image")
↓
createProduct

Required:

image
name
desc
price

Product is created with:

userId: req.user.userId

This automatically connects the product to the logged-in user.

# MULTER

Multer handles file uploads.

Current configuration:

multer({
storage: multer.memoryStorage()
})

Create/update uses:

upload.single("image")

This means:

* Exactly one file
* Field name must be "image"

Postman:

Body
→ form-data

image → File

## IMPORTANT:

If multiple files are uploaded using:

image

with upload.single("image"), Multer can throw:

MulterError: Unexpected file field

# PRODUCT OWNERSHIP

File:

src/middleware/productOwner.middleware.js

Purpose:

Make sure the current user owns the product.

Flow:

authMiddleware
↓
checkProductOwner
↓
controller

checkProductOwner performs:

1. Validate MongoDB ObjectId
2. Find product
3. Check product exists
4. Compare product.userId with req.user.userId
5. Store product in req.product

Example:

req.product = product

If product belongs to another user:

403

{
"message": "You are not allowed to access this product"
}

# FIND PRODUCT MIDDLEWARE

File:

src/middleware/findProduct.middleware.js

Purpose:

Find a product WITHOUT checking ownership.

It performs:

1. Validate ID
2. Find product
3. Check product exists
4. Store it in:

req.product

Difference:

findProduct
=
find product only

checkProductOwner
=
find product
+
check ownership

This distinction is important for admin routes.

# FIND USER MIDDLEWARE

File:

src/middleware/findUser.middleware.js

Purpose:

Find a target user for admin operations.

It stores the target user in:

req.userToManage

Important difference:

req.user
=
currently logged-in user

req.userToManage
=
user being managed by admin

# PRODUCT CRUD

## NORMAL USER ENDPOINTS

1. CREATE PRODUCT

POST /create-product

Requires authentication.

User can create their own product.

2. GET OWN PRODUCTS

GET /products

Returns products belonging to:

req.user.userId

3. GET SINGLE PRODUCT

GET /products/:id

Middleware:

authMiddleware
checkProductOwner

User can only access their own product.

4. UPDATE PRODUCT

PATCH /products/:id

Middleware:

authMiddleware
checkProductOwner
upload.single("image")

Only product owner can update.

5. DELETE PRODUCT

DELETE /products/:id

Middleware:

authMiddleware
checkProductOwner

Only product owner can delete.

# ADMIN PRODUCT ENDPOINTS

1. GET ALL PRODUCTS

GET /admin/products

Middleware:

authMiddleware
adminMiddleware

Admin can see products belonging to all users.

2. UPDATE ANY PRODUCT

PATCH /admin/products/:id

Middleware:

authMiddleware
adminMiddleware
findProduct
upload.single("image")

Important:

The SAME updateProduct controller is reused.

There is no need for a separate updateProductAdmin controller.

Why?

Normal user:

authMiddleware
↓
checkProductOwner
↓
updateProduct

Admin:

authMiddleware
↓
adminMiddleware
↓
findProduct
↓
updateProduct

The controller only needs:

req.product

3. DELETE ANY PRODUCT

DELETE /admin/products/:id

Middleware:

authMiddleware
adminMiddleware
findProduct

The SAME deleteProduct controller is reused.

# USER ENDPOINTS

1. REGISTER

POST /register

Body:

{
"name": "John",
"email": "[john@example.com](mailto:john@example.com)",
"password": "123456"
}

Role is automatically:

"user"

2. LOGIN

POST /login

Body:

{
"email": "[john@example.com](mailto:john@example.com)",
"password": "123456"
}

Successful response contains:

token

3. GET ALL USERS - ADMIN

GET /admin/users

Middleware:

authMiddleware
adminMiddleware

Password is excluded:

.select("-password")

# ADMIN USER MANAGEMENT

1. GET ALL USERS

GET /admin/users

2. UPDATE USER

PATCH /admin/users/:id

Middleware:

authMiddleware
adminMiddleware
findUser

Admin can currently update:

name
email
role

Example:

{
"name": "Updated Name",
"email": "[updated@example.com](mailto:updated@example.com)",
"role": "admin"
}

Password is excluded from the response.

3. DELETE USER

DELETE /admin/users/:id

Middleware:

authMiddleware
adminMiddleware
findUser

The admin cannot delete their own account.

# ROLE MANAGEMENT

An existing user can be manually changed to admin during development.

MongoDB:

"user"
↓
"admin"

After changing the role in MongoDB:

The user must login again.

Reason:

The role is stored inside the JWT.

Old JWT:

{
userId: "...",
role: "user"
}

New login generates:

{
userId: "...",
role: "admin"
}

## IMPORTANT:

Changing the MongoDB role does not automatically modify an already-issued JWT.

# ASYNC HANDLER

File:

src/middleware/asyncHandler.js

Purpose:

Avoid repeating try/catch in every async controller.

Pattern:

const asyncHandler = (controller) => {
return (req, res, next) => {
Promise
.resolve(controller(req, res, next))
.catch(next);
};
};

Usage:

const controller = asyncHandler(async (req, res) => {
// controller code
});

If an async error occurs:

controller
↓
.catch(next)
↓
errorMiddleware

# GLOBAL ERROR HANDLING

File:

src/middleware/error.middleware.js

Signature:

(error, req, res, next)

Handles:

1. Mongoose ValidationError
2. MongoDB CastError
3. Duplicate key error 11000
4. JsonWebTokenError
5. TokenExpiredError
6. Unknown errors

Validation error example:

{
"message": "Validation failed",
"errors": {
"name": "Path `name` is required."
}
}

Invalid ID:

{
"message": "Invalid ID"
}

Duplicate field:

409

Invalid JWT:

401

Expired JWT:

401

Unknown error:

500

# ERROR FLOW

Controller throws error
↓
asyncHandler
↓
next(error)
↓
errorMiddleware
↓
Proper HTTP response

# WHY USE MIDDLEWARE?

Middleware allows common logic to be reused.

Example:

Authentication:

authMiddleware

Admin authorization:

adminMiddleware

Product ownership:

checkProductOwner

Find product:

findProduct

Find user:

findUser

This keeps controllers focused on business logic.

# MIDDLEWARE DIFFERENCE

## authMiddleware

Question:

"Who is this user?"

Uses JWT.

Sets:

req.user

## adminMiddleware

Question:

"Is this user an admin?"

Checks:

req.user.role

## findProduct

Question:

"Does this product exist?"

Sets:

req.product

## checkProductOwner

Questions:

"Does this product exist?"

and:

"Does this product belong to this user?"

## findUser

Question:

"Does this target user exist?"

Sets:

req.userToManage

# ROUTE FLOW

NORMAL USER PRODUCT:

authMiddleware
↓
checkProductOwner
↓
controller

ADMIN PRODUCT:

authMiddleware
↓
adminMiddleware
↓
findProduct
↓
controller

ADMIN USER:

authMiddleware
↓
adminMiddleware
↓
findUser
↓
controller

# DATA RELATIONSHIP

One User can have many Products.

User:

_id = 123

Product:

userId = 123

Therefore:

User
|
├── Product A
├── Product B
└── Product C

This is how product ownership is maintained.

# IMPORTANT SECURITY RULES

1. Never store plain-text passwords.

2. Never return password hashes unnecessarily.

3. Never allow normal registration to accept:

role: "admin"

4. Protected routes must use authMiddleware.

5. Admin routes must use adminMiddleware.

6. Ownership-sensitive user routes must use checkProductOwner.

7. Do not expose JWT_SECRET publicly.

8. Never commit .env to Git.

9. Do not manually trust userId from request body for ownership.

Always use:

req.user.userId

10. When role changes, login again to get a fresh JWT.

# CURRENT API SUMMARY

## AUTH

POST   /register
POST   /login

## NORMAL PRODUCTS

POST   /create-product
GET    /products
GET    /products/:id
PATCH  /products/:id
DELETE /products/:id

## ADMIN PRODUCTS

GET    /admin/products
PATCH  /admin/products/:id
DELETE /admin/products/:id

## ADMIN USERS

GET    /admin/users
PATCH  /admin/users/:id
DELETE /admin/users/:id

# POSTMAN TESTING ORDER

Recommended testing order:

1. Register user

2. Login user

3. Copy JWT

4. Create product

5. Get own products

6. Get single product

7. Update own product

8. Delete own product

9. Create/login admin

10. Get all products as admin

11. Update another user's product as admin

12. Delete another user's product as admin

13. Get all users as admin

14. Update user as admin

15. Delete test user as admin

# IMPORTANT CONCEPTS LEARNED

1. Express routing

2. Controllers

3. Middleware

4. MongoDB

5. Mongoose models

6. Mongoose validation

7. ObjectId

8. Relationships using ObjectId

9. CRUD

10. Multer file upload

11. bcrypt password hashing

12. JWT authentication

13. Authorization

14. Role-based access control

15. Ownership-based access control

16. asyncHandler

17. Global error middleware

18. Reusable middleware

19. Admin management

20. Protected API routes

# CURRENT ARCHITECTURE

Request
|
↓
Route
|
↓
Authentication Middleware
|
↓
Authorization / Ownership Middleware
|
↓
Controller
|
↓
Model / Service
|
↓
MongoDB / Storage
|
↓
Response

# KEY RULE TO REMEMBER

AUTHENTICATION tells us:

"WHO are you?"

AUTHORIZATION tells us:

"ARE you allowed to do this?"

OWNERSHIP tells us:

"DOES this resource belong to you?"

Example:

authMiddleware
=
Who are you?

adminMiddleware
=
Are you an admin?

checkProductOwner
=
Is this your product?

findProduct
=
Does this product exist?

findUser
=
Does this target user exist?

# NEXT POSSIBLE FEATURES

The core backend is currently working.

Possible next improvements:

1. Prevent admin from accidentally locking themselves out

2. Decide what happens to a user's products when that user is deleted

3. Password change/reset system

4. Admin dashboard APIs

5. Pagination

6. Search and filtering

7. Product categories

8. Product stock/inventory

9. Better request validation

10. API documentation

11. Refresh tokens

12. Rate limiting

13. Production security improvements

# END
