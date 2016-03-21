var FileLive = require('tilelive-file'),
    template = require('lodash.template'),
    path = require('path'),
    qs = require('querystring'),
    url = require('url'),
    mkdirp = require('mkdirp');

function extend(dest) {
    var sources = Array.prototype.slice.call(arguments, 1),i, j, len, src;

    for (j = 0, len = sources.length; j < len; j++) {
        src = sources[j] || {};
        for (i in src) {
            if (src.hasOwnProperty(i)) {
                dest[i] = src[i];
            }
        }
    }
    return dest;
}

function TemplateLive(uri, callback) {    
    if (typeof uri === 'string') uri = url.parse(uri, true);
    else if (typeof uri.query === 'string') uri.query = qs.parse(uri.query);
    uri.query = uri.query || {};

    if (!uri.pathname) {
        callback(new Error('Invalid directory ' + url.format(uri)));
        return;
    }

    if (uri.hostname === '.' || uri.hostname == '..') {
        uri.pathname = uri.hostname + uri.pathname;
        delete uri.hostname;
        delete uri.host;
    }

    this.basepath = uri.pathname;
    this.filetype = uri.query.filetype || 'png';
    this.template = uri.query.template;
    this._template = template(this.template);
    mkdirp(this.basepath, function(err) {
        callback(err, this);
    }.bind(this));
    return undefined;
}

TemplateLive.registerProtocols = function(tilelive) {
    tilelive.protocols['template+file:'] = TemplateLive;
};

extend(TemplateLive.prototype, FileLive.prototype, {
   getPath:function(z, x, y, ext) {
       var filepath = this._template({
          'x' : x,
          'y' : y,
          'z' : z
       });
       return path.join(this.basepath, filepath +'.'+ext);
   } 
});

exports = module.exports = TemplateLive;