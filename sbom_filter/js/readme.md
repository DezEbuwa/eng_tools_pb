You can achieve the same result using Node.js by writing a script to process the CycloneDX SBOM and exclude components of type `operating-system`.

### Step 1: Create a Node.js script to filter the SBOM.

Here’s a Node.js version of the script (`filter_sbom.js`):

```javascript
const fs = require('fs');

// Function to filter out 'operating-system' components
function filterSbom(inputFile, outputFile) {
    // Read the input SBOM file
    const sbomData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    // Filter out components with type 'operating-system'
    const filteredComponents = sbomData.components.filter(component => component.type !== 'operating-system');

    // Replace the components array with the filtered data
    sbomData.components = filteredComponents;

    // Write the filtered SBOM to the output file
    fs.writeFileSync(outputFile, JSON.stringify(sbomData, null, 4), 'utf8');
    console.log(`Filtered SBOM saved as '${outputFile}'`);
}

// Check command line arguments
if (process.argv.length !== 4) {
    console.error("Usage: node filter_sbom.js <input_file> <output_file>");
    process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];

// Call the function to filter the SBOM
filterSbom(inputFile, outputFile);
```

### Step 2: Update your `.gitlab-ci.yml` file to use Node.js for the filtering.

1. **Ensure Node.js is available in the pipeline**: You can use a Node.js Docker image in the CI job.
2. **Pass the input and output file paths to the Node.js script**.

Here’s an example of the updated `.gitlab-ci.yml`:

```yaml
stages:
  - sbom

generate_sbom:
  stage: sbom
  image: node:20  # Use a Node.js image
  script:
    - echo "Generating SBOM with Syft..."
    - syft yourimage:latest -o cyclonedx-json > sbom-output.json
    - echo "Filtering out operating-system components using Node.js..."
    - node scripts/filter_sbom.js sbom-output.json filtered-sbom-output.json  # Pass input and output files to the Node.js script
  artifacts:
    paths:
      - filtered-sbom-output.json  # Save the filtered SBOM as an artifact
    expire_in: 1 week
```

### Explanation of the Node.js Script:
1. **fs Module**: The `fs` module is used to read the SBOM file and write the filtered SBOM.
2. **Command Line Arguments**: The script expects two arguments—`inputFile` and `outputFile`—which you can pass in the pipeline.
3. **Filtering**: It reads the SBOM, filters out components of type `operating-system`, and writes the filtered result to the specified output file.

### Step 3: Install any dependencies (if needed).

If your Node.js script requires any third-party dependencies (though the above example doesn't), you can add a `package.json` file and use `npm install` in the CI job to install them.

#### Example `before_script` for installing dependencies:
```yaml
before_script:
  - npm install  # Ensure any Node.js dependencies are installed if needed
```

This setup will ensure that your SBOM is processed using Node.js in your CI pipeline. Let me know if you need further adjustments!
