import express from "express";
import { User } from "../types/user";
import { login, register } from "../database";
import { secureMiddleware } from "../middleware/secureMiddleware";

export function loginRouter() {
    const router = express.Router();

    router.get("/login", async (req, res) => {
        res.render("login");
    });

    router.post("/login", async (req, res) => {
        const email: string = req.body.email;
        const password: string = req.body.password;
        try {
            let user: User = await login(email, password);
            delete user.password;
            req.session.user = user;

            res.redirect("/home");
        } catch (e: any) {
            res.redirect("/login");
        }
    });

    router.get("/register", async (req, res) => {
        res.render("register", { error: undefined });
    });

    router.post("/register", async (req, res) => {
        const username: string = req.body.username;
        const email: string = req.body.email;
        const password: string = req.body.password;
        try {
            await register(username, email, password);
            res.redirect("/login");
        } catch (e: any) {
            res.render("register", { error: e.message });
        }
    });

    router.post("/logout", secureMiddleware, async (req, res) => {
        req.session.destroy((err) => {
            res.redirect("/login");
        });
    });

    return router;
}