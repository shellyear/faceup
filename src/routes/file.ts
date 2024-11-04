import express from "express";
import { AppDataSource } from "../appDataSource";
import { File } from "../entity/file";

export const fileRouterPath = "/files";

const fileRouter = express.Router();
const fileRepository = AppDataSource.getRepository(File);

fileRouter.get("/download/:fileId", async (req, res) => {
  const { fileId } = req.params;

  const file = await fileRepository.findOneBy({ id: Number(fileId) });

  if (!file) {
    res.status(404).send("File not found");
    return;
  }

  res.setHeader("Content-Type", file.fileType);
  res.setHeader("Content-Disposition", `attachment; filename=${file.fileName}`);
  res.send(file.content);
});

fileRouter.delete("/:fileId", async (req, res) => {
  const { fileId } = req.params;

  try {
    const file = await fileRepository.findOneBy({ id: Number(fileId) });
    if (!file) {
      res.status(404).json({ error: "File not found degendei" });
      return;
    }

    await fileRepository.remove(file);

    res.status(204).send();
  } catch (error) {
    res.status(404).send("Report not found");
  }
});

export default fileRouter;
