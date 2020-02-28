require('dotenv').config()
const puppeteer = require('puppeteer')
const path = require('path')
const projects = require('./build_index.json')
const { readdir } = require('fs')

puppeteer.launch({
    headless: false,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
})
    .then(async browser => {
        for (let index = 0; index < projects.length; index++) {
            const project = projects[index]
            const projectFiles = await new Promise((resolve, reject) => {
                readdir(path.join(__dirname, `${project.path}`), (err, files) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(files)
                })
            })
            if(projectFiles.includes('index.html')) {
                const page = await browser.newPage()
                const { directory } = project
                await page.goto(`file://${path.join(__dirname, `../../dist/my_projects/${directory}`)}/index.html`)
                await page.addScriptTag({
                    url: './bundle.js',
                })
                await page.evaluate(() => {
                    document.dispatchEvent(new Event('load'))
                    document.dispatchEvent(new Event('DOMContentLoaded'))
                })
                try {
                    await page.screenshot({ path: `${path.join(__dirname, `/${directory}/cover.jpeg`)}`, type: 'jpeg' })
                    await page.screenshot({ path: `${path.join(__dirname, `../../dist/my_projects/${directory}/cover.jpeg`)}`, type: 'jpeg' })
                } catch (err) {
                    console.warn(err)
                }
            }
        }
        // browser.close()
    })
    .catch(err => {
        console.log(err)
    })