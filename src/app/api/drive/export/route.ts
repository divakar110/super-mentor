import { auth } from "@/auth";
import { createFolderIfNotExists, uploadFileToDrive } from "@/lib/drive";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !(session as any).accessToken) {
        return NextResponse.json({ error: "Unauthorized or missing Google Access Token" }, { status: 401 });
    }

    try {
        const { title, content, type } = await req.json();
        const accessToken = (session as any).accessToken;

        // 1. Ensure "Anti Gravity Notebooks" folder exists
        const folderId = await createFolderIfNotExists(accessToken, "Anti Gravity Notebooks");

        // 2. Prepare file content (convert text to buffer)
        // For PDF, we might need to fetch the original URL if 'content' is just text.
        // Assuming 'content' here is the text content for now, we create a text file or doc.
        // If the user wants to upload the ORIGINAL PDF, we need the PDF URL or Buffer.
        // Let's assume for this MVP we are creating a Google Doc from the notes

        // Actually, NotebookLM works best with PDFs or Docs.
        // If type is "pdf" and we have a URL, we might need to fetch it then upload.
        // But if we just have text content (extracted notes), we upload as text/plain

        const fileName = `${title}.txt`;
        const buffer = Buffer.from(content || "No content");

        const uploadedFile = await uploadFileToDrive(
            accessToken,
            buffer,
            fileName,
            "text/plain",
            folderId
        );

        return NextResponse.json({ success: true, fileId: uploadedFile.id, webLink: uploadedFile.webViewLink });

    } catch (error: any) {
        console.error("Export Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
