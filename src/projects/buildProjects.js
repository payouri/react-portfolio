require('dotenv').config()
const Projects = require('./index.json')
const config = require('./compilerOptions')
const { readdir, writeFile } = require('fs')
const path = require('path')
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const md = require('markdown-it')()

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
            writeFile(path.join(__dirname, 'build_index.json'), JSON.stringify(projects.map(p => { const { fullPath, ...rest } = p; return rest })), (err) => {
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
                new CopyWebpackPlugin(projects.reduce((arr, p) => {
                    if(p.sources.indexOf('cover.jpeg') > -1) {
                        arr.push({
                            from: p.fullPath + '/cover.jpeg',
                            to: path.join(__dirname, `../../dist/my_projects/${p.directory}`)
                        })
                    }
                    return arr
                }, [])),
                new HtmlWebpackExcludeAssetsPlugin()
            ]
        })

        compiler.run(async (err, stats) => {
            if (err) {
                throw err
            }
            console.log('build projects ok')
        })
    })
    .catch(err => {
        console.warn('build projects failed')
        console.warn(err)
    })