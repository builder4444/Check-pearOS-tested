# Check if your pearOS device may work

A static website that lets people:

- Search a list of community-tested devices and compatibility status for core components.
- Add local test results in the browser.
- Copy generated JSON and submit it through a pull request.

## Deploy with GitHub Actions

This repository includes `.github/workflows/deploy-pages.yml` that automatically deploys the site to GitHub Pages whenever `main` is updated.

## Data format

Device records live in `data/devices.json` and use this shape:

```json
{
  "deviceModel": "PearBook Air 13",
  "chip": "Pear Silicon P1",
  "gpu": "PearGPU 8-core",
  "wifi": "Working",
  "bluetooth": "Working",
  "audio": "Working",
  "camera": "Partial",
  "overallStatus": "Mostly Works",
  "notes": "Optional notes",
  "submittedBy": "Name",
  "testedOn": "YYYY-MM-DD"
}
```
