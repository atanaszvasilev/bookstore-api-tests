import fs from 'fs';
import path from 'path';
import { fileLogger } from './logger';

/**
 * Converts an absolute file path to a relative path from the current working directory,
 * and replaces backslashes with forward slashes for cross-platform consistency.
 *
 * @function
 * @param {string} absolutePath - The absolute path to convert.
 * @returns {string} The relative, POSIX-style path.
 */
export function relative(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath).replace(/\\/g, '/');
}

/**
 * Creates the specified file if it does not exist.
 * Ensures parent directories exist before creating the file.
 * Logs the creation or warnings/errors if the file already exists or cannot be created.
 *
 * @function
 * @param {string} filePath - The path to the file to be created.
 */
export function createFile(filePath: string) {
  try {
    fileLogger.debug(`📄 Creating file at: "${relative(filePath)}"`);

    // Ensure parent directories exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      fileLogger.info(`📂 Created parent directories for: "${relative(filePath)}"`);
    }

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, ''); // create empty file
      fileLogger.info(`✅ Created file at: "${relative(filePath)}"`);
    } else {
      fileLogger.info(`ℹ️ File already exists at: "${relative(filePath)}"`);
    }
  } catch (error) {
    fileLogger.warn(`⚠️ Failed to create file at: "${relative(filePath)}"`, error);
  }
}

/**
 * Deletes the specified folder and all its contents recursively if it exists.
 * Logs the deletion or warnings/errors if the folder doesn't exist or cannot be deleted.
 * 
 * @function
 * @param {string} folderPath - The path to the folder to be deleted.
 */
export function deleteFolder(folderPath: string) {
  try {
    fileLogger.debug(`🔄 Deleting folder at: "${relative(folderPath)}"`);
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      fileLogger.info(`🗑️📂 Deleted folder at: "${relative(folderPath)}"`);
    } else {
      throw new Error(`Folder not found`);
    }
  } catch (error) {
    fileLogger.warn(`⚠️ Failed to delete folder at: "${relative(folderPath)}"`, error);
  }
}

/**
 * Deletes the specified file if it exists.
 * If the file doesn't exist, a warning is logged.
 * If the file cannot be deleted due to an error, it logs the error.
 * 
 * @function
 * @param {string} filePath - The path to the file to be deleted.
 */
export function deleteFile(filePath: string) {
  try {
    fileLogger.debug(`🔄 Deleting file at: "${relative(filePath)}"`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      fileLogger.info(`🗑️📄 Deleted file at: "${relative(filePath)}"`);
    } else {
      throw new Error(`File not found`);
    }
  } catch (error) {
    fileLogger.warn(`⚠️ Failed to delete file at: "${relative(filePath)}"`, error);
  }
}

/**
 * Deletes all files inside the specified folder (non-recursive).
 * Subfolders and their contents are not deleted.
 * Logs each deleted file and handles errors or missing folder cases gracefully.
 * 
 * @function
 * @param {string} folderPath - The path to the folder whose files should be deleted.
 */
export function deleteAllFilesInFolder(folderPath: string) {
  try {
    fileLogger.debug(`🔄 Deleting all files in folder: "${path.relative(process.cwd(), folderPath)}"`);

    if (!fs.existsSync(folderPath)) {
      throw new Error(`Folder not found`);
    }

    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    const files = entries.filter(entry => entry.isFile());

    if (files.length === 0) {
      fileLogger.info(`ℹ️ No files to delete in: "${path.relative(process.cwd(), folderPath)}"`);
      return;
    }

    for (const file of files) {
      const filePath = path.join(folderPath, file.name);
      fs.unlinkSync(filePath);
      fileLogger.info(`🗑️📄 Deleted: "${path.relative(process.cwd(), filePath)}"`);
    }
  } catch (error) {
    fileLogger.warn(`⚠️ Failed to delete files in: "${path.relative(process.cwd(), folderPath)}"`, error);
  }
}

/**
 * Deletes all files and subfolders inside the specified folder (recursive).
 * Logs each deleted file/folder and handles errors or missing folder gracefully.
 * 
 * @function
 * @param {string} folderPath - The path to the folder whose contents should be deleted.
 */
export function deleteAllInFolder(folderPath: string) {
  try {
    fileLogger.debug(`🔄 Deleting all contents of folder: "${path.relative(process.cwd(), folderPath)}"`);

    if (!fs.existsSync(folderPath)) {
      fileLogger.warn(`⚠️ Folder not found: "${path.relative(process.cwd(), folderPath)}"`);
      return;
    }

    const entries = fs.readdirSync(folderPath, { withFileTypes: true });

    if (entries.length === 0) {
      fileLogger.info(`ℹ️ No contents to delete in: "${path.relative(process.cwd(), folderPath)}"`);
      return;
    }

    for (const entry of entries) {
      const entryPath = path.join(folderPath, entry.name);

      if (entry.isDirectory()) {
        // Recursively delete subfolder
        deleteAllInFolder(entryPath);
        fs.rmdirSync(entryPath);
        fileLogger.info(`🗑️📂 Deleted folder: "${path.relative(process.cwd(), entryPath)}"`);
      } else if (entry.isFile()) {
        fs.unlinkSync(entryPath);
        fileLogger.info(`🗑️📄 Deleted file: "${path.relative(process.cwd(), entryPath)}"`);
      }
    }
  } catch (error) {
    fileLogger.warn(
      `⚠️ Failed to delete contents of folder: "${path.relative(process.cwd(), folderPath)}"`,
      error
    );
  }
}

/**
 * Writes the specified content to a file. If the parent directory does not exist,
 * it creates the necessary directories. Logs the action and any errors encountered.
 * 
 * @function
 * @param {string} filePath - The path to the file to be written.
 * @param {string} content - The content to write to the file.
 */
export function writeFile(filePath: string, content: string) {
  try {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    fileLogger.debug(`🔄 Writing file at: "${relative(filePath)}"`);
    fs.writeFileSync(filePath, content);
    fileLogger.info(`📝 Wrote file at: "${relative(filePath)}"`);
  } catch (error) {
    fileLogger.warn(`⚠️ Failed to write file at: "${relative(filePath)}"`, error);
  }
}

/**
 * Reads and returns the content of a file. Logs the action and any errors encountered.
 * 
 * @function
 * @param {string} filePath - The path to the file to be read.
 * @returns {string | undefined} The file content if read successfully; otherwise, undefined.
 */
export function readFile(filePath: string): string | undefined {
  try {
    fileLogger.debug(`🔄 Reading file at: "${relative(filePath)}"`);
    const file = fs.readFileSync(filePath, 'utf8');
    fileLogger.info(`📖 Read file at: "${relative(filePath)}"`);
    return file;
  } catch (error) {
    fileLogger.warn(`⚠️ Failed to read file at: "${relative(filePath)}"`, error);
  }
}

/**
 * Appends content to a file. Logs the action and any errors encountered.
 * 
 * @function
 * @param {string} filePath - The path to the file to be appended.
 * @param {string} content - The content to append to the file.
 * @returns {void}
 */
export function appendFile(filePath: string, content: string): void {
  try {
    fileLogger.debug(`➕ Appending to file at: "${relative(filePath)}"`);
    fs.appendFileSync(filePath, content, 'utf8');
    fileLogger.info(`✍️ Appended to file at: "${relative(filePath)}"`);
  } catch (error) {
    fileLogger.warn(`⚠️ Failed to append to file at: "${relative(filePath)}"`, error);
  }
}