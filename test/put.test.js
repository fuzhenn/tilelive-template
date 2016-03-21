var assert = require('assert'),
    fs = require('fs');
var rimraf = require('rimraf');
var templatelive = require('..');

describe('putting', function() {
    afterEach(function(done) {
        // clear up tmp files
        rimraf("./tmp", done);
    });

    describe('a tile', function() {
        it('should write a corresponding file', function(done) {
            new templatelive('./tmp/sink?filetype=txt&template=${z}/${x}/${y}', function(err, sink) {
                if (err) return done(err);

                var tileData = '3/7/7';

                sink.putTile(3, 7, 7, tileData, function(err) {
                    if (err) return done(err);

                    fs.readFile('./tmp/sink/3/7/7.txt', function(err, data) {
                        if (err) return done(err);

                        assert.equal(tileData, data);
                        return done();
                    });
                });
            });
        });
    });

    describe('a grid', function() {
        it('should write a corresponding file', function(done) {
            new templatelive('./tmp/sink?template=${z}/${x}/${y}', function(err, sink) {
                if (err) return done(err);

                var grid = { foo: "bar" };

                sink.putGrid(3, 7, 7, grid, function(err) {
                    if (err) return done(err);

                    fs.readFile('./tmp/sink/3/7/7.json', function(err, data) {
                        if (err) return done(err);

                        assert.equal(JSON.stringify(grid), data);
                        return done();
                    });
                });
            });
        });

    });
});
