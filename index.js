const _ = require('lodash');
const es = require('event-stream');
const AWS = require('aws-sdk');
const mime = require('mime');
const gutil = require('gulp-util');

module.exports = function(options){
    if(!options.region){
        throw new Error('Missing config "region"');
    }
    if(!options.bucket){
        throw new Error('Missing config "bucket"');
    }

    options.folder = standardizeFolderOptions(options.folder);

    let s3 = new AWS.S3({
        accessKeyId: process.env.key || options.key,
        secretAccessKey: process.env.secret || options.secret,
        region: options.region,
    });
    return es.map((file, callback)=>{
        
        if(!file.isBuffer()){
            callback(null, file);
            return;
        }

        let key = file.path.replace(file.base, options.folder).replace(/\\/g, '/');

        if(options.filter && !match(options.filter, file.path) || options.reject && match(options.reject, file.path)){
            gutil.log(gutil.colors.yellow('IGNORE'), key);
            callback(null, file);
            return;
        }

        let params = Object.assign({
            Bucket: options.bucket,
            Key: key,
            Body: file.contents,
            ContentType: mime.getType(file.path),
            ACL: 'public-read',
        }, options.params);

        s3.upload(params, function(err, data){
            if(err){
                gutil.log(gutil.colors.red('FAIL'), key);
                callback(new gutil.PluginError('', err));
            }else{
                gutil.log('SUCCESS', key);
                callback(null, file)
            }
        });
    });
};

function standardizeFolderOptions(folder){
    if(!folder) return '';
    // Make sure folder is not start width slash and end width slash. 
    let slash = '/';
    return _.compact(folder.split(slash)).join(slash) + slash;
}

//判断一个字符串是否满足条件：匹配正则表达式，或者函数结果为真
function match(condition, value){
    if(_.isRegExp(condition)){
        return condition.test(value);
    }else if(_.isFunction(condition)){
        return condition(value);
    }
    return false;
}