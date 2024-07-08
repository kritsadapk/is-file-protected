# is-file-protected

A library to check if various file types are encrypted.

## Usage example

```typescript
import { checkFileEncrypted } from "is-file-protected";
const isFileEncrypted = await checkFileEncrypted(filePath);

if (!isFileEncrypted) {
  // do something
}
```
