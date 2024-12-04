Here’s how you can structure a GitLab CI/CD pipeline to achieve what you want: using Syft to generate a CycloneDX SBOM, saving the SBOM as an artifact, and then using that artifact in another job to create a bundle with your custom software package.

### 1. **Pipeline Structure**

The pipeline will have two main jobs:
- **Job 1:** Create the SBOM using Syft and save it as a CycloneDX SBOM artifact.
- **Job 2:** Download the SBOM artifact and use it to create a bundle with your custom software.

### 2. **Sample `.gitlab-ci.yml`**

```yaml
stages:
  - generate-sbom
  - create-bundle

variables:
  SBOM_FILE: "sbom.json"

# Job 1: Generate CycloneDX SBOM
generate_sbom:
  stage: generate-sbom
  image: anchore/syft:latest
  script:
    - syft . -o cyclonedx-json > $SBOM_FILE
  artifacts:
    paths:
      - $SBOM_FILE
    expire_in: 1 week
  only:
    - branches  # Run on all branches (or you can specify only specific branches)

# Job 2: Use SBOM to create a bundle
create_bundle:
  stage: create-bundle
  image: registry.gitlab.com/your-image:latest  # Your custom software package container
  dependencies:
    - generate_sbom
  script:
    - echo "SBOM downloaded. Creating a bundle using the SBOM..."
    - ./your-custom-software --input $SBOM_FILE --output bundle.tar.gz  # Your bundle command
  artifacts:
    paths:
      - bundle.tar.gz
    expire_in: 1 week
  only:
    - branches
```

### 3. **Explanation of Key Sections**

- **Stages:**
  - `generate-sbom`: This stage generates the SBOM using Syft.
  - `create-bundle`: This stage takes the SBOM artifact and runs your custom software to create a bundle.

- **Job 1: Generate SBOM**
  - **Image:** The job uses the `anchore/syft` image to generate the SBOM.
  - **Script:** Runs the `syft . -o cyclonedx-json` command to create the CycloneDX SBOM in JSON format, saving it as `sbom.json`.
  - **Artifacts:** The generated `sbom.json` file is saved as an artifact for use in later jobs, with a retention period of one week.

- **Job 2: Create Bundle**
  - **Image:** This job uses your custom Docker image (replace `registry.gitlab.com/your-image:latest` with the actual image path) that contains the software to create the bundle.
  - **Dependencies:** This ensures that the `create_bundle` job depends on the `generate_sbom` job and downloads the SBOM artifact from that job.
  - **Script:** This runs your custom command to process the SBOM and create the bundle. Replace `./your-custom-software --input $SBOM_FILE --output bundle.tar.gz` with the actual command for your software.
  - **Artifacts:** The generated bundle is saved as an artifact (`bundle.tar.gz`) for later use or download.

### 4. **Custom Software Package**

Make sure your custom software package (used in the `create_bundle` job) is packaged in a Docker container and hosted either in GitLab’s Container Registry or another container registry. The software should accept the SBOM file as input and generate the bundle you need.

### 5. **Testing and Iterating**

Once you have your `.gitlab-ci.yml` in place, test it by pushing to your GitLab repository and observing the pipeline execution. Adjust the paths and software commands as necessary for your specific setup.

This structure provides a robust workflow to generate, store, and utilize the SBOM, which aligns well with DevSecOps and software supply chain security practices.
