const express = require('express')

const { updateRentalStatus, getRentals, getRental } = require('../controllers/rentals.controller')
const authorize = require("../middlewares/authorize");

const router = express.Router()

router.patch("/:rental_id/return", authorize, updateRentalStatus)

router.get("/", authorize, getRentals)

router.get("/:rental_id/", authorize, getRental)

module.exports = router