const fs = require('fs');

/**
 * add url-route in /controllers
 * @param {*} router
 * @param {*} mapping
 */
function addMapping(router, mapping) {
  for (let url in mapping) {
    if (url.startsWith('GET')) {
      let path = url.substring(4);
      router.get(path, mapping[url]);
      console.log(`register URL mapping: GET ${path}`);
    } else if (url.startsWith('POST')) {
      let path = url.substring(5);
      router.post(path, mapping[url]);
      console.log(`register URL mapping: POST ${path}`);
    } else {
      console.log(`invalid URL: ${url}`);
    }
  }
}

function addControllers(router, dir) {
  // 全局变量：__dirname 当前模块的目录名
  fs.readdirSync(__dirname + '/' + dir)
    .filter((f) => {
      return f.endsWith('.js');
    })
    .forEach((f) => {
      console.log(`process controller: ${f}...`);
      let mapping = require(__dirname + '/controllers/' + f);
      // mapping 是module.exports暴露出的对象
      addMapping(router, mapping);
    });
}

module.exports = function (dir) {
  let controllers_dir = dir || 'controllers', // 如果不传参数，扫描目录默认为'controllers'
    router = require('koa-router')();
  addControllers(router, controllers_dir);
  return router.routes();
};
