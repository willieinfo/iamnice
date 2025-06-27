/**
 * Validates a JSON object and ensures it is properly formatted before fetching.
 * @param {Object} jsonData - The JSON object to validate.
 * @returns {Promise} - A promise that resolves if valid, rejects if invalid.
 */
function validateAndFetch(jsonData) {
  return new Promise((resolve, reject) => {
    try {
      // 1. Ensure the object is a valid JSON object
      if (typeof jsonData !== 'object' || jsonData === null) {
        throw new Error("Invalid JSON format: The data should be an object.");
      }

      // 2. Validate required fields (Example: FILENAME, CATEGORY, LOCATION, etc.)
      const requiredFields = ["FILENAME", "CATEGORY", "LOCATION", "CAPTION_", "DESCRIPT"];
      for (let field of requiredFields) {
        if (!jsonData.hasOwnProperty(field)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // 3. Validate the values of fields (check for non-empty strings for example)
      if (typeof jsonData.FILENAME !== 'string' || jsonData.FILENAME.trim() === "") {
        throw new Error("Invalid FILENAME: It must be a non-empty string.");
      }

      if (typeof jsonData.CATEGORY !== 'string' || jsonData.CATEGORY.trim() === "") {
        throw new Error("Invalid CATEGORY: It must be a non-empty string.");
      }

      if (typeof jsonData.LOCATION !== 'string' || jsonData.LOCATION.trim() === "") {
        throw new Error("Invalid LOCATION: It must be a non-empty string.");
      }

      if (typeof jsonData.CAPTION_ !== 'string' || jsonData.CAPTION_.trim() === "") {
        throw new Error("Invalid CAPTION_: It must be a non-empty string.");
      }

      if (typeof jsonData.DESCRIPT !== 'string' || jsonData.DESCRIPT.trim() === "") {
        throw new Error("Invalid DESCRIPT: It must be a non-empty string.");
      }

      // 4. Optionally validate specific patterns (like image URLs in FILENAME)
      const filePattern = /\.(jpg|jpeg|png|gif)$/i;
      if (!filePattern.test(jsonData.FILENAME)) {
        throw new Error("Invalid FILENAME: It must be an image file (jpg, jpeg, png, gif).");
      }

      // 5. Check for unescaped newline characters in the DESCRIPT field
      if (jsonData.DESCRIPT.includes("\n")) {
        console.warn("Warning: The DESCRIPT field contains newline characters.");
        // Optionally, you can decide to escape the newlines or handle them differently
        jsonData.DESCRIPT = jsonData.DESCRIPT.replace(/\n/g, '\\n'); // escape newlines
      }

      // If all validations pass, resolve the promise
      resolve(jsonData);

    } catch (error) {
      // If any validation fails, reject with an error message
      reject(error.message);
    }
  });
}

/**
 * Example usage to validate and fetch the data.
 */
function sendJsonData(jsonData) {
  validateAndFetch(jsonData)
    .then(validatedData => {
      console.log("Validated JSON:", validatedData);

      // Proceed with fetch if valid
      fetch('your-endpoint-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData)
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

    })
    .catch(error => {
      // Handle validation errors
      console.error("Validation failed:", error);
    });
}

// Example JSON data to test
const jsonData = {
  "FILENAME": "/Lots/407LotAyala.png",
  "CATEGORY": "LOTS",
  "LOCATION": "AYALA GREEN",
  "CAPTION_": "FOR SALE 407 sqm Lot in Phase 5A Ayala Greenfield Estates",
  "DESCRIPT": "o 407 sqm\n o Phase 5A\n o Clean title\n o Regular Cut\n o w/ appurtenant class B golf share\n o Gently rolling\n\nAsking Price 12.5M\n\nCode MYPFS168"
};

// Run the function
sendJsonData(jsonData);
