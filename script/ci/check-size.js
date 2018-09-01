const fs = require('fs');
const stats = fs.statSync('dist/release.zip');
const fileSizeInBytes = stats.size;
const maxFileSize = 1024 * 13;

const message = `File size of "dist/release.zip" is ${fileSizeInBytes}/${maxFileSize} bytes (${(100 *
  fileSizeInBytes) /
  maxFileSize}) %`;
if (fileSizeInBytes > maxFileSize) {
  console.error(message);
  process.exit(1);
} else {
  console.info(message);
  process.exit(0);
}
