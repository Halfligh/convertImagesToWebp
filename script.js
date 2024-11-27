const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const baseFolder = "UserFiles";
const inputFolder = path.join(baseFolder, "1.InputImages"); // Renommé pour inclure PNG et JPG
const outputFolder = path.join(baseFolder, "2.ConvertedToWebp");
const oldImagesFolder = path.join(baseFolder, "3.SavedOldImages");

// Créez le dossier principal s'il n'existe pas
if (!fs.existsSync(baseFolder)) {
  fs.mkdirSync(baseFolder);
  console.log("Dossier de base correctement créé");
}

// Créez les sous-dossiers dans le dossier principal
[inputFolder, outputFolder, oldImagesFolder].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
    console.log(`Dossier ${folder} créé avec succès`);
  }
});

// Lisez le contenu du dossier InputImages
fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error("Erreur lors de la lecture du dossier:", err);
    return;
  }

  // Filtrer les fichiers PNG et JPG/JPEG
  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ext === ".png" || ext === ".jpg" || ext === ".jpeg";
  });

  imageFiles.forEach((file) => {
    const inputFilePath = path.join(inputFolder, file);
    const outputFilePath = path.join(outputFolder, file.replace(/\.(png|jpg|jpeg)$/, ".webp"));

    sharp(inputFilePath).toFile(outputFilePath, (err, info) => {
      if (err) {
        console.error(`Erreur lors de la conversion de l'image ${file.slice(0, 20)}:`, err);
      } else {
        console.log(
          `Conversion réussie de l'image ${file.slice(
            0,
            20
          )} en WebP et enregistrée sous : ${outputFilePath}`
        );

        // Déplacez l'image originale vers SavedOldImages
        const oldImagePath = path.join(oldImagesFolder, file);
        fs.rename(inputFilePath, oldImagePath, (err) => {
          if (err) {
            console.error(
              `Erreur lors du déplacement de ${file.slice(0, 20)} vers OldImages:`,
              err
            );
          } else {
            console.log(
              `Archivage réussi de l'original : ${file.slice(
                0,
                20
              )} dans le dossier : ${oldImagePath}`
            );
          }
        });
      }
    });
  });
});
