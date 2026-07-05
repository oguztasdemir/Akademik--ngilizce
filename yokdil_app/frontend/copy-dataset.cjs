const fs = require('fs');
const path = require('path');

const projectRootDir = path.resolve(__dirname, '..');
const sourceDataset = path.join(projectRootDir, 'dataset');

const targetSrcDataset = path.join(__dirname, 'src', 'dataset');
const targetPublicDataset = path.join(__dirname, 'public', 'dataset');

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  fs.readdirSync(from).forEach(element => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

try {
  if (fs.existsSync(sourceDataset)) {
    console.log(`Synchronizing datasets from: ${sourceDataset}`);
    
    // 1. Copy to src/dataset
    if (fs.existsSync(targetSrcDataset)) {
      fs.rmSync(targetSrcDataset, { recursive: true, force: true });
    }
    copyFolderSync(sourceDataset, targetSrcDataset);
    console.log(`Copied to frontend/src/dataset`);

    // 2. Copy to public/dataset
    if (fs.existsSync(targetPublicDataset)) {
      fs.rmSync(targetPublicDataset, { recursive: true, force: true });
    }
    copyFolderSync(sourceDataset, targetPublicDataset);
    console.log(`Copied to frontend/public/dataset`);
  } else {
    console.error(`Source dataset directory not found at: ${sourceDataset}`);
  }
} catch (e) {
  console.error('Error copying dataset folder:', e);
}
