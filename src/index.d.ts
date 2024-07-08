/// <reference types="node" />
declare module "is-file-protected" {
  function checkFileEncrypted(filePath: string): Promise<boolean>;
}
