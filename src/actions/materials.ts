import { getApiUrl } from "@/lib/config";

export const getMaterials = async () => {
    try {
        const response = await fetch(getApiUrl("/api/materials"));
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const addMaterial = async (values: {
    title: string;
    subject: string;
    type: string;
    content: string;
}) => {
    try {
        const response = await fetch(getApiUrl("/api/materials"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });

        if (!response.ok) return { error: "Failed to add material" };
        return { success: "Material added!" };
    } catch (error) {
        return { error: "Something went wrong!" };
    }
};
