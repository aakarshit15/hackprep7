import jwt from "jsonwebtoken";
import User from "../models/user_model.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

const register = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        return res.status(200).json({
            message: "New User Registered!",
            user: newUser,
        });
    } catch (error) {
        console.error(`Error registering user: ${error}`);
        return res.status(500).json({ error: "Registration failed." });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        const user = await User.findOne({ email }).lean();

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const { password: _, ...userWithoutPassword } = user;
        const token = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({ token });
    } catch (error) {
        console.error(`Error logging in: ${error}`);
        return res.status(500).json({ error: "Login failed." });
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const updated = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        return res.status(200).json(updated);
    } catch (error) {
        console.error(`Error updating user: ${error}`);
        return res.status(500).json({ error: "Update failed." });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ message: "User deleted" });
    } catch (error) {
        console.error(`Error deleting user: ${error}`);
        return res.status(500).json({ error: "Delete failed." });
    }
}

export {
    register,
    login,
    updateUser,
    deleteUser,
}