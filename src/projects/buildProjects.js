const Projects = require('./index.json')
const config = require('./compilerOptions')
const { readdir, writeFile } = require('fs')
const path = require('path')
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const md = require('markdown-it')()

const projects = Projects.map(async p => {

    if(p.path) {
        const fullPath = path.resolve(__dirname + p.path);
        const files = await new Promise((resolve, reject) => {
            readdir(fullPath, (err, files) => {
            

                if(err) 
                    reject([err])

                resolve(files)

            })
            
        })
        p.fullPath = fullPath
        p.sources = files
    }
    if(p.body) {

        p.htmlBody = md.render(p.body).toString();

    }

    return p;

})

Promise.all(projects)
    .then(projects => {
        new Promise((resolve, reject) => {
            writeFile(path.join(__dirname, 'build_index.json'), JSON.stringify(projects.map(p => { const { fullPath, ...rest } = p; return rest })), (err) => {
                if(err) {
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
                if(project.sources.indexOf('main.js')) {
                    arr[project.directory] = project.fullPath + '/main.js'
                } else {
                    console.warn('project: ', project.name, ' as no main file')
                }
                return arr
            }, {}),
            plugins: [...projects.map(p => (
                new htmlWebpackPlugin({
                    title: p.name,
                    template: p.fullPath + '/index.html',
                    filename: p.directory + '/index.html'
                }) 
            )),
            /* new MiniCssExtractPlugin({
                filename: '[name]/styles.css'
            }) */]
            
        })

        compiler.run((err, stats) => {
            if(err) {
                throw err
            }
            console.log('build projects ok')
        })
    })
    .catch(err => {
        console.warn(err)
    })