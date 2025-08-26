// src/services/UserService.ts
import db from "../models";
import { UserAttributes } from "../models/user";

class UserService {
    // CREATE
    async createUser(data: Omit<UserAttributes, "id" | "createdAt" | "updatedAt">) {
        return await db.User.create(data);
    }

    // READ - get all
    async getAllUsers() {
        return await db.User.findAll();
    }

    // READ - get one
    async getUserById(id: number) {
        return await db.User.findByPk(id);
    }

    // UPDATE
    async updateUser(id: number, data: Partial<UserAttributes>) {
        const user = await db.User.findByPk(id);
        if (!user) return null;
        await user.update(data);
        return user;
    }

    // DELETE
    async deleteUser(id: number) {
        const user = await db.User.findByPk(id);
        if (!user) return null;
        await user.destroy();
        return user;
    }
}

export default new UserService();
