#!/usr/bin/env node

"use strict";
const generator = require("./critical");
const path = require("path");
const fs = require("fs");
const makeDir = require("make-dir");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const urls = process.env.URL;
const dimensions = process.env.DIMENSIONS || "1300x900";
const location = process.env.LOCATION || "/output";
const urlArray = urls.split(",");
let counter = 1;

async function outputFileAsync(file, data) {
  const dir = path.join(__dirname, file);

  if (!fs.existsSync(dir)) {
    await makeDir(dir);
  }

  return writeFileAsync(`${dir}/critical-${counter}.css`, data);
}

const extractor = async () => {
  const singleUrl = urlArray.pop();
  if (!singleUrl) {
    return Promise.resolve();
  }
  return generator
    .generateCritical(singleUrl, dimensions, location)
    .then(async (css) => {
      if (css.length > 10) {
        await outputFileAsync(location, css).then(() =>
          console.log(
            `Done. critical-${counter}.css saved in ${location}/critical-${counter}.css `
          )
        );
        counter++;
        return urlArray.length > 0 && extractor();
      } else
        console.log("Invalid css generated! Please try with different URL");
    })
    .catch((err) => {
      // console.error(err);
      console.error(err.name);
      console.error(err.message);
    });
};
extractor();
