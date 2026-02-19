✅ How to Use

Create a folder structure:

project-root/
 ├─ csv/       <-- put all your Beeline CSVs here
 ├─ json/      <-- output JSONs will go here
 ├─ convertBeelineCsv.ts


Install TypeScript/Node if not already installed:

npm init -y
npm install typescript @types/node
npx tsc --init


Run the converter:

npx ts-node convertBeelineCsv.ts


Your JSON files will appear in json/ ready to import into Explorer.