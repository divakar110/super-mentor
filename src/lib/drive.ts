import { google } from "googleapis";

// This helper uses the User's access token (from NextAuth session)
export async function getDriveClient(accessToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    return google.drive({ version: "v3", auth });
}

export async function createFolderIfNotExists(accessToken: string, folderName: string) {
    const drive = await getDriveClient(accessToken);

    // Check if folder exists
    const res = await drive.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
        fields: "files(id, name)",
    });

    if (res.data.files && res.data.files.length > 0) {
        return res.data.files[0].id;
    }

    // Create folder
    const fileMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
    };

    const file = await drive.files.create({
        requestBody: fileMetadata,
        fields: "id",
    });

    return file.data.id;
}

export async function uploadFileToDrive(accessToken: string, fileBuffer: Buffer, fileName: string, mimeType: string, parentFolderId?: string) {
    const drive = await getDriveClient(accessToken);
    const { Readable } = require("stream");
    const stream = Readable.from(fileBuffer);

    const fileMetadata: any = {
        name: fileName,
    };

    if (parentFolderId) {
        fileMetadata.parents = [parentFolderId];
    }

    const media = {
        mimeType: mimeType,
        body: stream,
    };

    const file = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id, webViewLink",
    });

    return file.data;
}
