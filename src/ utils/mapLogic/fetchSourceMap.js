/**
 * Given the URL of a page, fetch its JavaScript and extract the sourceMappingURL.
 * This version assumes the sourceMappingURL comment is at the end of the JS file.
 * @param {string} pageUrl
 * @returns {Promise<string>} full URL of the .map file
 */
export async function fetchSourceMapUrl(pageUrl) {
    const response = await fetch(pageUrl);
    const text = await response.text();
  
    // Regex looks for //# sourceMappingURL=xxxx.map or //@ sourceMappingURL=xxxx.map
    const regex = /sourceMappingURL=(.*\.map)/;
    const match = text.match(regex);
  
    if (!match) {
      throw new Error("Source map URL not found");
    }
  
    // Resolve relative URL to absolute
    const sourceMapRelativeUrl = match[1].trim();
    const baseUrl = new URL(pageUrl);
  
    const sourceMapUrl = new URL(sourceMapRelativeUrl, baseUrl).toString();
  
    return sourceMapUrl;
  }
  