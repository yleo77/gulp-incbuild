
module.exports.extend = function extend(target, source) {
  if (source) {
    for (var key in source) {
      if (typeof source[key] === 'object') {
        target[key] = target[key] || (Array.isArray(source[key]) ? [] : {});
        extend(target[key], source[key]);
      } else {
        source.hasOwnProperty(key) && (target[key] = source[key]);
      }
    }
  }
  return target;
};

module.exports.log = function log(info, type) {

  var prefix = '';
  var suffix = '';
  switch (type) {
    case 'success':
      prefix = ('>>').green + ' ';
      suffix = ' ' + ('[ ✔ ]').green;
      break;
    case 'fail':
      prefix = ('>>').red + ' ';
      suffix = ' ' + ('[ ✖ ]').red;
      break;
    case 'warn':
      prefix = ('>>').yellow + ' ';
      suffix = ' ' + ('[ ! ]').yellow;
      break;
    default:
      break;
  }

  console.log(!info ? '' : (prefix + info + suffix));
};