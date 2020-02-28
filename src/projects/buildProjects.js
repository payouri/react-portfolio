require('dotenv').config()
const Projects = require('./index.json')
const config = require('./compilerOptions')
const { readdir, writeFile } = require('fs')
const path = require('path')
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const md = require('markdown-it')()
const puppeteer = require('puppeteer')

puppeteer.launch({
    // headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
})
    .then(browser => {

        // console.log(browser)
        const projects = Projects.map(async p => {

            if (p.path) {
                const fullPath = path.resolve(__dirname + p.path);
                const files = await new Promise((resolve, reject) => {
                    readdir(fullPath, (err, files) => {


                        if (err)
                            reject([err])

                        resolve(files)

                    })

                })
                p.fullPath = fullPath
                p.sources = files
            }
            if (p.body) {

                p.htmlBody = md.render(p.body).toString();

            }

            return p;

        })

        Promise.all(projects)
            .then(projects => {
                new Promise((resolve, reject) => {
                    writeFile(path.join(__dirname, 'build_index.json'), JSON.stringify(projects.map(p => { const { fullPath, ...rest } = p;  return rest })), (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve()
                    })
                }).then(() => {
                    console.warn('build_index.json created')
                }).catch(err => {
                    console.warn(err)
                })
                const compiler = webpack({
                    ...config,
                    entry: projects.reduce((arr, project) => {
                        if (project.sources.indexOf('main.js') > -1) {
                            arr[project.directory] = project.fullPath + '/main.js'
                        } else {
                            console.warn('project: ', project.name, ' has no main file')
                        }
                        return arr
                    }, {}),
                    plugins: [
                        ...projects.map(p => (
                            new htmlWebpackPlugin({
                                title: p.name,
                                template: p.fullPath + '/index.html',
                                filename: `my_projects/${p.directory}/index.html`,
                                inject: true,
                                excludeAssets: [new RegExp(`^((?!${p.directory}).)*$`)]
                            })
                        )),
                        new HtmlWebpackExcludeAssetsPlugin()
                        /* new MiniCssExtractPlugin({
                            filename: '[name]/styles.css'
                        }) */
                    ]
                })

                compiler.run(async (err, stats) => {
                    if (err) {
                        throw err
                    }
                    for (let index = 0; index < projects.length; index++) {
                        const project = projects[index]
                        const page = await browser.newPage()
                        if(project.sources.indexOf('index.html') > -1) {
                            const { directory } = project
                            await page.goto(`file://${path.join(__dirname, `../../dist/my_projects/${directory}`)}/index.html`)
                            await page.addScriptTag({
                                url: './bundle.js'
                            })
                            await page.evaluate(() => {
                                document.dispatchEvent(new Event('load'))
                                document.dispatchEvent(new Event('DOMContentLoaded'))
                            })
                            try {
                                await page.screenshot({ path: `${path.join(__dirname, `../../dist/my_projects/${directory}/cover.jpeg`)}`, type: 'jpeg' })
                            } catch(err) {
                                console.warn(err)
                            }
                        }
                    }
                    // console.log(stats)
                    browser.close()
                    console.log('build projects ok')
                })
            })
            .catch(err => {
                console.warn('build projects failed')
                console.warn(err)
            })
    })
    .catch(err => {
        console.log(err)
    })