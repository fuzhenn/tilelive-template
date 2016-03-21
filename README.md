# tilelive-template

[![Circle CI](https://circleci.com/gh/FuZhenn/tilelive-template.svg?style=svg)](https://circleci.com/gh/FuZhenn/tilelive-template)

Same as tilelive-file but get file's path from a path template

##Introduction
This is tilelive adapter for local files, same as mapbox's [tilelive-file](https://github.com/mapbox/tilelive-file).

tilelive-file's path rule is set to {z}/{x}/{y}, but in reality, the path rule to store tile files is usually arbitrary.

tilelive-template thinks a path template phrase can be used to interprate XYZ to an actual file path.

For example, some vendor stores a tile in the following path:

given a tile's coordinates (x: 54305 y:26571 z:16)

stored file path: /path/to/root/16/5430/2657/5430_2657.png

In this case, we can use the following as the path template:
```javascript
'/path/to/tiles/{z}/${parseInt(x/10)}/${parseInt(y/10)}/${x}_${y}.png';
```

This is the reason tilelive-template is borned. 

tilelive-template uses [lodash.template](https://lodash.com/docs#template) as the template engine, and ES delimiter(${foo}) is used as the default "interpolate" delimiter.

You can see how to use it in the example below.

#Install
```bash
npm install tilelive-template
```

##Tilelive Protocol
```javascript
// template is the path template 
// filetype is the tile file's type, default is png
var protocol = 'template+file://path/to/root?template=${z}/${x}/${y}&filetype=png';
```

##Usage
```javascript
var TemplateLive = require('tilelive-template'),
    assert = require('assert');

new TemplateLive('./test/fixtures/readonly?template=${z}/${x}/${y}&filetype=png', function(err, source) {
    if (err) throw err;
    source.getTile(0, 0, 0, function(err, tile) {
        if (err) throw err;
        assert.equal(md5(tile), 'e071213b7ca2f1c10ee8944300f461bd');        
    });
});

```