'use strict';

var path = require('path'),
    express = require('express'),
    browserify = require('browserify'),
    app = express();
// 自动注入 livereload 和 weinre
var livereloadPort = 35729,
    weinreId = '',
    genScript = function (src) {
        return src ? '<script src="' + src + '"><\\/script>' : '';
    },
    snippet = '\n<script>//<![CDATA[\ndocument.write(\'' +
        genScript('//\' + (location.hostname || \'localhost\') + \':' + livereloadPort + '/livereload.js') +
        (weinreId ? genScript('//weinre.uae.ucweb.local/target/target-script-min.js#' + weinreId) : '') +
        '\')\n//]]></script>\n';

app.use(require('connect-inject')({
    snippet: snippet
}));

// 根目录
var basePath = process.cwd() + '/example';
app.use(express.static(basePath));

app.get('/', function (req, res) {
    res.sendfile('./index.html');
});
app.get('/bundle.js', function (req, res) {
    res.set('Content-Type', 'application/javascript');
    browserify( path.join(basePath, 'js/bootstrap.js'), {
        debug: true
    })
      .transform('babelify', {presets: ['es2015']})
      .bundle(function (err, buff) {
        res.send(err ? 'console.log(' + JSON.stringify(err.message) + ');' : buff.toString());
    });
});

// app.get('/subpath/getchn', function(req, res) {
//     res.send({
//         code: '000',
//         msg: '',
//         data: 2
//     });
// });

// app.get('/subpath/addchn', function(req, res) {
//     res.send({
//         code: '000',
//         msg: ''
//     });
// });

// app.get('/subpath/getgift', function(req, res) {
//     res.send({
//         code: '000',
//         msg: '',
//         data: [{
//             prizeName: 'smart phone',
//             prizeCode: '001'
//         }]
//     });
// });

// app.get('/subpath/draw', function(req, res) {
//     var random = parseInt(Math.random() * 10);
//     random = 2;
//     if (random % 2 === 0) {
//         res.send({ // 中奖
//             code: '000',
//             msg: '',
//             data: {
//                 prizeInfo: {
//                     prizeName: 'OPPO R7s',
//                     prizeCode: '100'
//                 },
//                 chances: 1
//             }
//         });
//     } else {
//         res.send({ // 未中奖
//             code: '000',
//             msg: '',
//             data: {
//                 prizeInfo: {},
//                 chances: 0
//             }
//         });
//     }
// });

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server listening on port ' + port);
});