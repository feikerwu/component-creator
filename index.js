#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const resolve = (...filePaths) => path.resolve(process.cwd(), ...filePaths)

const config = require(resolve('./config'))

if (typeof config === 'undefined') {
    console.error('config not exist')
    process.exit(1)
}

const noop = () => {}

/**
 * 判断一个文件夹是否存在
 * @param {String} path 文件路径
 */
const isExist  = function(path) {
    try {
        fs.accessSync(path, fs.constants.F_OK)
        return true
    } catch (err) {
        return false
    }
}

/**
 *  新建文件夹
 * @param {String} dir 文件夹名字
 */
const mkdir = function(dir) {
    isExist(dir) ? noop() : fs.mkdirSync(dir)
}

/**
 * 文件名
 * @param {String} filename 文件名字
 */
const writeFile = function(filename) {
    if (!isExist(`${filename}.vue`)) {
        let template = fs.createReadStream(path.resolve(__dirname, 'template.vue'))
        let component = fs.createWriteStream(filename)
        template.pipe(component)
    }
}



config.forEach(item => {
    let { dir, components } = item
    dir = dir ? dir : './'

    mkdir(resolve(dir))
    components.forEach(component => {
        writeFile(resolve(dir, `${component}.vue`))
    })
})

