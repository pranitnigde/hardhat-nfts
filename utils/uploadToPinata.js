const pinataSdk = require("@pinata/sdk");
const path = require("path");

async function storeImages(imagesFilePath) {
  const fullImagePath = path.resolve(imagesFilePath);
  const files = fs.readdirSync(fullImagePath);
  console.log(files);
}

module.exports = { storeImages, storeTokenUriMetadata };