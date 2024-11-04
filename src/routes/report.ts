import express from "express";
import multer from "multer";
import { Report } from "../entity/report";
import { AppDataSource } from "../appDataSource";
import { File } from "../entity/file";
import { fileRouterPath } from "./file";

export const reportRouterPath = "/reports";

const reportRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const reportRepository = AppDataSource.getRepository(Report);
const fileRepository = AppDataSource.getRepository(File);

reportRouter.post("/", upload.array("files"), async (req, res) => {
  const { category, senderName, senderAge, description } = req.body;
  const files = (req.files as Express.Multer.File[]) || [];

  const newReport = reportRepository.create({
    category,
    senderName,
    senderAge,
    description,
  });

  await reportRepository.save(newReport);

  for (const file of files) {
    const newFile = fileRepository.create({
      report: newReport,
      content: file.buffer,
      fileName: file.filename || file.originalname,
      fileType: file.mimetype,
    });
    await fileRepository.save(newFile);
  }

  res.status(201).json(newReport);
});

reportRouter.get("/", async (req, res) => {
  const reports = await reportRepository.find({ relations: ["files"] });

  const reportsWithDownloadLinks = reports.map((report) => ({
    ...report,
    files: report.files.map((file) => ({
      id: file.id,
      fileName: file.fileName,
      fileType: file.fileType,
      downloadLink: `${req.protocol}://${req.get(
        "host"
      )}${fileRouterPath}/download/${file.id}`, // URL to download the file
    })),
  }));

  res.json(reportsWithDownloadLinks);
});

reportRouter.get("/:id", async (req, res) => {
  const report = await reportRepository.findOne({
    where: { id: parseInt(req.params.id) },
    relations: ["files"],
  });

  if (!report) {
    res.status(404).send("Report not found");
    return;
  }

  const reportWithFiles = {
    ...report,
    files: report.files.map((file) => ({
      id: file.id,
      fileName: file.fileName,
      fileType: file.fileType,
      downloadLink: `${req.protocol}://${req.get(
        "host"
      )}${fileRouterPath}/download/${file.id}`,
    })),
  };

  res.json(reportWithFiles);
});

reportRouter.put("/:id", async (req, res) => {
  const { category, senderName, senderAge, description } = req.body;

  const foundReport = await reportRepository.findOneBy({
    id: parseInt(req.params.id),
  });

  if (!foundReport) {
    res.status(404).send("Report not found");
    return;
  }

  foundReport.category = category;
  foundReport.senderName = senderName;
  foundReport.senderAge = senderAge;
  foundReport.description = description;

  await reportRepository.save(foundReport);

  res.json(foundReport);
});

reportRouter.delete("/:id", async (req, res) => {
  const result = await reportRepository.delete(req.params.id);
  if (result.affected) res.send("Report deleted");
  else res.status(404).send("Report not found");
});

export default reportRouter;
