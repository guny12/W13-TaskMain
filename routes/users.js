const express = require("express");
const router = express.Router();
const { User } = require("../db/models");
const { asyncHandler, csrfProtection } = require("./utils");
const { userValidators } = require("./validators");
const bcrypt = require('bcryptjs');

/* GET users listing. */
router.get(
	"/",
	csrfProtection,
	userValidators,
	asyncHandler(async (req, res) => {
		const user = User.build();

		res.render("sign-up", {
			title: "sign-up",
			user,
			csrfToken: req.csrfToken(),
		});
	})
);

router.post(
	"/",
	csrfProtection,
	userValidators,
	asyncHandler(async (req, res) => {
		const { firstName, lastName, email, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({ firstName, lastName, email, hashedPassword });
		req.session.userAuth = { id: user.id }

		res.redirect('/projects');
	})
);

module.exports = router;
