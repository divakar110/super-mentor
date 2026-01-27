import { signIn } from "next-auth/react";
import { z } from "zod";
import { getApiUrl } from "@/lib/config";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const RegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Minimum 6 characters required"),
});

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            return { error: "Invalid credentials!" };
        }

        // Redirect handled by component or return success to let component redirect
        // Ideally next-auth/react signIn handles redirect if redirect: true
        // But here we return object.
        return { success: "Logged in!" };
    } catch (error) {
        return { error: "Something went wrong!" };
    }
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    try {
        // We assume the backend has this route, effectively moving the logic from the action to an API route
        const response = await fetch(getApiUrl("/api/register"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validatedFields.data),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        return { error: "Something went wrong!" };
    }
};
