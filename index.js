var path = require('path');
var fs = require('fs');

var gutil = require('gulp-util');
var minimist = require('minimist');
var through = require('through2');
var colors = require('colors');
var incrementify = require('incrementify');

var helper = require('./lib/helper.js');

/* jshint -W104 */
const PLUGIN_NAME = 'gulp-incbuild';
var PluginError = gutil.PluginError;
var argv = minimist(process.argv.slice(2));
var log = argv.silent ? function() {} : helper.log;

var config = {
  chunkSize: 12
};

function gulpIncbuild(opt) {

  return through.obj(function start(file, encoding, callback) {

    if (file.isNull()) {
      return callback(null, file);
    }

    var options = setup(opt);
    if (options.chunkSize) {
      config.chunkSize = options.chunkSize;
    }

    var relpath = path.relative(file.cwd, file.path);

    var abspaths = {
      last: path.resolve(file.cwd, options.last_dir) + '/' + relpath,
      current: file.path
    };

    config.output = path.resolve(file.cwd, options.inc_dir) + '/' + relpath.replace(/\.(js|css)$/, '-inc.$1');

    var data = incrementify.build(abspaths.last, abspaths.current, config);

    // status = 1 需要给出的是 warn
    if(!data.status && data.signal !== 1) {
      return callback(new PluginError(PLUGIN_NAME, '增量文件生成失败', {
        fileName: file.path,
        showStack: false
      }));
    }

    var ret = {
      message: relpath + ' 增量文件生成成功',
      type: 'success',
    };
    if (!data.status) {
      if (data.signal === 1) {
        ret.message = relpath + ' 对应旧版本文件不存在，请确认';
        ret.type = 'warn';
      }
    }
    log(ret.message, ret.type);
    return callback(null, file);
  });
}

module.exports = gulpIncbuild;

function setup(opts) {
  var options = helper.extend({
    last_dir: './dist/production',    // 线上版本文件存放
    inc_dir: './dist/release'         // 增量文件存放路径
  }, opts || {});

  return options;
}