"use strict"
let express = require('express');
let formidable = require('formidable');
let router = express.Router();
let dataBase = new Map();

/* GET users listing. */
router.get('/compute', function(req, res, next) {
    if (req.headers['hw-token'] !== '1234567890')
        next(403);
    else {
        let type = req.query.type;
        let firstParam = Number(req.query.firstParam);
        let secondParam = Number(req.query.secondParam);

        if (type === 'ADD'){
            return res.send({ans: firstParam + secondParam});

        }

        else if (type === 'SUB'){
            return res.send({ans: firstParam - secondParam});
        }

        else if (type === 'MUL'){
            return res.send({ans: firstParam * secondParam});
        }

        else if (type === 'DIV'){
            return res.send({ans: firstParam / secondParam});
        }
    }
});


router.use('/pair', function (req, res, next) {
    if (req.headers['hw-token'] !== '1234567890')
        next(403);
    else {
        if (req.method === "POST"){
            let form = new formidable.IncomingForm();
            let post = {};
            form
                .on('error', function(err) {
                    console.log(err);
                })
                .on('field', function(field, value) {
                    post[field] = value;
                })
                .on('end', function() {
                    dataBase.set(post['key'], post["value"]);
                    res.send('Post Complete'); //解析完毕 做其他work
                });
            form.parse(req);
        }

        else if (req.method === "GET"){
            if (dataBase.has(req.query.key))
                res.send({value: dataBase.get(req.query.key)});

            else
                next(404);
        }

        else if (req.method === "DELETE") {
            if (dataBase.has(req.query.key)) {
                dataBase.delete(req.query.key);
                res.send("Delete Complete");
            }

            else
                next(404);
        }
    }
});

module.exports = router;
