# is-file-protected

A library to check if various file types are encrypted.

## Usage example

```typescript
import { checkFileEncrypted } from "is-file-protected";
const isFileEncrypted = await checkFileEncrypted(filePath);

if (!isFileEncrypted) {
  // file not protected
}

// file protected
```

### File supported

- PDF
- DOCX
- XLSX
- PPTX
- PPT (use msoffcrypto-tool)
- DOC (use msoffcrypto-tool)
- XLS (use msoffcrypto-tool)

### File supported (Coming soon)

- ZIP
- RAR
- 7Z
- TAR
- GZIP
