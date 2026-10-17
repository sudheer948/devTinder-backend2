DevTinder APIs

// if the application becomes larger and larger, there are so many api's or maybe 100s of api's created in a single file of app.js and so to solve this problem, we are using express router
// when we create an new application using express, start using express.router from day 1

authRouter
- POST /signup
- POST /login
- POST /logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestRouter
<!-- 
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId             -->
- POST /request/send/:status/:userId

<!-->
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId       -->
- POST /request/review/:status/:requestId

userRouter
- GET /user/requests
- GET /user/connections
- GET /user/feed - Gets you the profiles of other users on platform
