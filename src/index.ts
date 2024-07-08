import fs from "fs";
import { PDFDocument } from "pdf-lib";
import officeParser from "officeparser";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

const checkPDFEncrypted = async (filePath) => {
  const pdfBytes = fs.readFileSync(filePath);
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return !pdfDoc.isEncrypted;
  } catch (error) {
    return false;
  }
};

const isOfficeFileEncrypted = async (filePath: string | Buffer) => {
  try {
    await officeParser.parseOfficeAsync(filePath);
    return false;
  } catch (error) {
    console.error(error);
    return true;
  }
};

const isOfficeFileEncryptedWithMsoffcrypto = async (filePath) => {
  const command = `msoffcrypto-tool -i "${filePath}" -o /dev/null -t`;
  try {
    const { stderr } = await execPromise(command);
    return stderr.includes("encrypted");
  } catch (error) {
    console.error(error);
    return true;
  }
};

const checkFileEncrypted = async (filePath) => {
  const extension = filePath.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      const pdfEncrypted = await checkPDFEncrypted(filePath);
      return !pdfEncrypted;
    case "docx":
    case "pptx":
    case "xlsx":
      const officeFileEncrypted = await isOfficeFileEncrypted(filePath);
      return officeFileEncrypted;
    case "doc":
    case "ppt":
    case "xls":
      return await isOfficeFileEncryptedWithMsoffcrypto(filePath);
    default:
      console.log(`File type ${extension} not supported.`);
      return false;
  }
};

// ทดสอบไฟล์
// checkFileEncrypted("./file-test/file-sample.doc").then((r) => {
//   console.log(r);
// });

export { checkFileEncrypted };
