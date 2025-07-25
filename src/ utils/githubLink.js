/**
 * Construct GitHub URL to the original source file at a specific line.
 * Modify this to match your repo/org/branch.
 * @param {string} sourcePath - Path to source file relative to repo root
 * @param {number} lineNumber
 * @returns {string}
 */
export function makeGithubUrl(sourcePath, lineNumber) {
    const orgRepo = "my-org/my-repo"; // Replace with your GitHub org/repo
    const branch = "main"; // Or your default branch
  
    // Clean leading "./" or "/"
    const cleanPath = sourcePath.replace(/^(\.\/|\/)/, "");
  
    return `https://github.com/${orgRepo}/blob/${branch}/${cleanPath}#L${lineNumber}`;
  }
  