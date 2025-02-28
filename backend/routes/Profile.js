const express = require("express");
const UserStore = require("../store/UserStore");
const Session = require("../services/Session");
const TestMode = require("../TestMode");

const router = express.Router();

router.post("/create", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        var profile = {
            userId: req.body.userId,
            name: req.body.name,
            biography: req.body.biography,
            categories: req.body.categories,
            image: req.body.image ? req.body.image : null
        };
        return await UserStore.createUser(profile).then(result => {
            if (result.code === 200) {
                return res.sendStatus(200);
            }
            return res.status(result.code).send(result.message);
        }, err => {
            return res.status(500).send({ message: err.toString() });
        });
    }
    return res.status(403).send({ message: Session.invalid_msg });
});

router.get("/:userId/get", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        return await UserStore.getUserProfile(req.params.userId).then(result => {
            if (result.code === 200) {
                return res.status(200).send(result.payload);
            }
            return res.status(result.code).send(result.message);
        }, err => {
            return res.status(500).send({ message: err.toString() });
        });
    }
    return res.status(403).send({ message: Session.invalid_msg });
});

router.put("/:userId/edit", async (req, res) => {
    if (Session.validSession(req.headers.cookie) || TestMode.on) {
        var profile = {
            name: req.body.name,
            biography: req.body.biography,
            categories: req.body.categories,
            image: req.body.image ? req.body.image : null
        };
        return await UserStore.updateUser(req.params.userId, profile).then(result => {
            if (result.code === 200) {
                return res.sendStatus(200);
            }
            return res.status(result.code).send(result.message);
        }, err => {
            return res.status(500).send({ message: err.toString() });
        });
    }
    return res.status(403).send({ message: Session.invalid_msg });
});

module.exports = router;