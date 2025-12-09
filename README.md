# WebGenie
A Web-based Ineractive Platform for Benchmarking Gene Regulatory Network Inference from Single-Cell Transcriptomin Data. WebGenie is built upon BEELINE extending it to be Web-based and modular.


  # WebGenie

 This is the codebase for the WebGenie project, the UI design is accessible on figma as shared. 

Here are few more changes to be made in this version: 

For the dashboard page:
1. Dataset metadata cards was added, which includes source, size and last updated, which grant users the ease to assess dataset suitability briefly.
2. Exposure of algorithm versioning and brief performance summaries on the Dashboard was also compounded, so users can quickly see which algorithm iteration is in use plus at‑a‑glance status indicators such as dataset pending/approved and algorithm last run date.
3. Also, a mini‑preview/quick chart for each dataset to improve scannability was included, which includes small sparklines and thumbnail visual.

For the Compare page: 
1. Multi‑metric comparison like precision, recall and runtime was allowed as well as toggles for normalizing metrics.
2. Provision of an export function was made available in the design, so comparison results can be downloaded for offline review.

On the Upload page,  there was a stronger input validation and user 
guidance like clear error messages, accepted formats and sample templates, as well as proper consideration for access control and role‑based visibility, where users can upload, approve datasets, or run benchmark comparisons.

Then also, there were proper arrangements made for the UI to clearly signal the dataset/algorithm workflow steps from upload → validation → analysis → compare, so users can follow the intended pipeline.

Finally, each run emphasizes the importance of traceability, such that every comparison or analysis result is linkable back to the dataset version and algorithm parameters used.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## link to the 6 Pages
  DASHBOARD PAGE
  http://localhost:3000/

  COMPARE PAGE
  http://localhost:3000/compare

  EXPLORER PAGE
  http://localhost:3000/explorer

  UPLOAD PAGE
  http://localhost:3000/upload

  RUNS PAGE
  http://localhost:3000/run/RUN-2024-1123-044

  DASHBOARD PAGE
  http://localhost:3000/dataset/Time-series

  
