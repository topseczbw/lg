#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const ejs = require('ejs');

inquirer
    .prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Project name?',
        }
    ])
    .then((answers) => {
        console.log(answers);

        const tmpDir = path.join(__dirname, 'template');
        const destDir = process.cwd();

        fs.readdir(tmpDir, (err, files) => {
            if (err) return;

            files.forEach((item) => {
                ejs.renderFile(path.join(tmpDir, item), answers, (error, result) => {
                    if (error) return;

                    fs.writeFileSync(path.join(destDir, item), result);
                });
            });
        });
    });
