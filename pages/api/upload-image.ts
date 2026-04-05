import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "node:fs/promises";
import path from "node:path";

type UploadResponse = {
  path?: string;
  error?: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

function asSingleValue(value: string | string[] | undefined): string {
  if (!value) {
    return "";
  }
  return Array.isArray(value) ? value[0] ?? "" : value;
}

function sanitizeSegment(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

function getExtension(fileName: string, mimeType?: string): string {
  const fromName = path.extname(fileName || "").toLowerCase();
  if (fromName) {
    return fromName;
  }

  if (mimeType === "image/jpeg") {
    return ".jpg";
  }
  if (mimeType === "image/png") {
    return ".png";
  }
  if (mimeType === "image/webp") {
    return ".webp";
  }
  if (mimeType === "image/gif") {
    return ".gif";
  }

  return ".png";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const form = formidable({
    multiples: false,
    maxFileSize: 10 * 1024 * 1024,
    filter: ({ mimetype }) => Boolean(mimetype?.startsWith("image/")),
  });

  const { fields, files } = await new Promise<{
    fields: formidable.Fields;
    files: formidable.Files;
  }>((resolve, reject) => {
    form.parse(req, (error, parsedFields, parsedFiles) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ fields: parsedFields, files: parsedFiles });
    });
  });

  const fileValue = files.file;
  const uploadedFile = Array.isArray(fileValue) ? fileValue[0] : fileValue;

  if (!uploadedFile) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const titleSegment = sanitizeSegment(asSingleValue(fields.projectTitle)) || "project";
  const sectionSegment = sanitizeSegment(asSingleValue(fields.section)) || "misc";

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "projects",
    titleSegment,
    sectionSegment
  );

  await fs.mkdir(uploadDir, { recursive: true });

  const extension = getExtension(uploadedFile.originalFilename || "", uploadedFile.mimetype || undefined);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${extension}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.copyFile(uploadedFile.filepath, filePath);

  const publicPath = `/uploads/projects/${titleSegment}/${sectionSegment}/${fileName}`;
  res.status(200).json({ path: publicPath });
}
