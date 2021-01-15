#!/usr/bin/env node

"use strict";
const generator = require("./critical");
const path = require("path");
const fs = require("fs");
const makeDir = require("make-dir");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

const url = process.env.URL;
const dimensions = process.env.DIMENSIONS || "1300x900";
const location = process.env.LOCATION || "/output";

async function outputFileAsync(file, data) {
  const dir = path.join(__dirname, file);

  if (!fs.existsSync(dir)) {
    await makeDir(dir);
  }

  return writeFileAsync(`${dir}/critical.css`, data);
}

generator
  .generateCritical(url, dimensions, location)
  .then((css) => {
    console.log(css);
    if (css.length > 10)
      outputFileAsync(location, css).then(() =>
        console.log(`Done. critical.css saved in ${location}/critical.css `)
      );
    else console.log("Invalid css generated! Please try with different URL");
  })
  .catch((err) => {
    // console.error(err);
    console.error(err.name);
    console.error(err.message);
  });
