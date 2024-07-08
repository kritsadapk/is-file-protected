import AdmZip from "adm-zip";
import * as fs from "fs";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";

const checkPDFEncrypted = async (filePath: string): Promise<boolean> => {
  const pdfBytes = fs.readFileSync(filePath);
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return !pdfDoc.isEncrypted;
  } catch (error) {
    console.error("Error reading PDF:", error);
    return false;
  }
};

const checkDOCXEncrypted = async (filePath: string): Promise<boolean> => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return !result.value.includes("Encryption");
  } catch (error) {
    console.error("Error reading DOCX:", error);
    return false;
  }
};

const checkXLSXEncrypted = async (filePath: string): Promise<boolean> => {
  try {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();
    const workbookXml = zipEntries.find(
      (entry: { entryName: string }) => entry.entryName === "xl/workbook.xml"
    );
    const sharedStringsXml = zipEntries.find(
      (entry: { entryName: string }) =>
        entry.entryName === "xl/sharedStrings.xml"
    );

    if (workbookXml && sharedStringsXml) {
      const workbookData = workbookXml.getData().toString("utf8");
      const sharedStringsData = sharedStringsXml.getData().toString("utf8");

      // ตรวจสอบหาคำว่า "Encryption" หรือการเข้ารหัสในข้อมูล XML
      return !(
        workbookData.includes("<Encryption") ||
        sharedStringsData.includes("<Encryption")
      );
    } else {
      console.error("Required XML files are missing in XLSX.");
      return false;
    }
  } catch (error) {
    console.error("Error reading XLSX:", error);
    return false;
  }
};

const checkPPTXEncrypted = async (filePath: string): Promise<boolean> => {
  try {
    const zip = new AdmZip(filePath);
    const xmlFiles = zip
      .getEntries()
      .filter((entry: { entryName: string }) =>
        entry.entryName.endsWith(".xml")
      );

    // ตรวจสอบไฟล์ XML ที่เกี่ยวข้องใน PPTX เพื่อดูข้อมูลการเข้ารหัส
    for (const file of xmlFiles) {
      const data = file.getData().toString("utf8");
      if (data.includes("<enc:Encryption")) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error reading PPTX:", error);
    return false;
  }
};

const checkFileEncrypted = async (filePath: string): Promise<boolean> => {
  const extension = filePath.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      const pdfEncrypted = await checkPDFEncrypted(filePath);
      console.log(
        `PDF file ${filePath} is ${
          pdfEncrypted ? "not encrypted" : "encrypted"
        }.`
      );
      return pdfEncrypted;
    case "docx":
      const docxEncrypted = await checkDOCXEncrypted(filePath);
      console.log(
        `DOCX file ${filePath} is ${
          docxEncrypted ? "not encrypted" : "encrypted"
        }.`
      );
      return docxEncrypted;
    case "xlsx":
      const xlsxEncrypted = await checkXLSXEncrypted(filePath);
      console.log(
        `XLSX file ${filePath} is ${
          xlsxEncrypted ? "not encrypted" : "encrypted"
        }.`
      );
      return xlsxEncrypted;
    case "pptx":
    case "ppt":
      const pptxEncrypted = await checkPPTXEncrypted(filePath);
      console.log(
        `PPTX file ${filePath} is ${
          pptxEncrypted ? "not encrypted" : "encrypted"
        }.`
      );
      return pptxEncrypted;
    default:
      console.log(`File type ${extension} not supported.`);
      return false;
  }
};

module.exports = {
  checkFileEncrypted,
};
