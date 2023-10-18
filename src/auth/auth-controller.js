const passport = require('passport')
const router = require('express').Router()

const jwt = require("jsonwebtoken")

const onAuthenticateSuccess = (req, res) => {
    jwt.sign({ user: req.user }, "secretKey", { expiresIn: "7d" },
    (err, token) => {
        if (err) return res.redirect("/")

        res.cookie('X-Anifan-Token-JWT', token, { expires: new Date(Date.now() + 60000 * 10080) })
        return res.redirect("/")
    })
}

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get("/google/callback", passport.authenticate('google', { failureRedirect: '/', session: false }), onAuthenticateSuccess)
  
router.get("/user/count/:id", (req, res) => {
    res.send()

    const id = req.params.id
    userCounter[id] = (userCounter[id] || 0) + 1
})

const userCounter = {}

setInterval(() => {
    const users = Object.keys(userCounter).map(function(key){ return userCounter[key] })
    const views = calculateSum(users)

    console.log({users: users.length, views})
},  5 * 60 * 1000)

function calculateSum(array) {
    return array.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
}

module.exports = router