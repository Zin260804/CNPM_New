import { Request, Response } from "express";
import db from "../models";
import UserService from "../services/UserService"; // ✅ import class mới

// Trang chủ
const getHomePage = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await UserService.getAllUsers();
        res.render("homepage.ejs", {
            data: JSON.stringify(users),
        });
    } catch (error) {
        console.error("❌ getHomePage error:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Trang About
const getAboutPage = (_req: Request, res: Response): void => {
    res.render("test/about.ejs");
};

// Trang CRUD form
const getCRUD = (_req: Request, res: Response): void => {
    res.render("crud.ejs");
};

// Lấy danh sách User
const getFindAllCrud = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await UserService.getAllUsers();
        res.render("users/findAllUser.ejs", { datalist: users });
    } catch (error) {
        console.error("❌ getFindAllCrud error:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Tạo mới User
const postCRUD = async (req: Request, res: Response): Promise<void> => {
    try {
        await UserService.createUser(req.body);
        res.redirect("/crud/findAll");
    } catch (error) {
        console.error("❌ postCRUD error:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Lấy dữ liệu để Edit
const getEditCRUD = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number(req.query.id);
        if (!userId) {
            res.status(400).send("Invalid ID");
            return;
        }

        const user = await UserService.getUserById(userId);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        res.render("users/editUser.ejs", { data: user });
    } catch (error) {
        console.error("❌ getEditCRUD error:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Update User
const putCRUD = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number(req.body.id);
        await UserService.updateUser(userId, req.body);

        const users = await UserService.getAllUsers();
        res.render("users/findAllUser.ejs", { datalist: users });
    } catch (error) {
        console.error("❌ putCRUD error:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Delete User
const deleteCRUD = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.query.id);
        if (!id) {
            res.status(400).send("Invalid ID");
            return;
        }

        await UserService.deleteUser(id);
        res.redirect("/crud/findAll");
    } catch (error) {
        console.error("❌ deleteCRUD error:", error);
        res.status(500).send("Internal Server Error");
    }
};

export {
    getHomePage,
    getAboutPage,
    getCRUD,
    postCRUD,
    getFindAllCrud,
    getEditCRUD,
    putCRUD,
    deleteCRUD,
};
