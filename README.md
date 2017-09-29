# gulp-upload-s3

基于 aws-sdk 的将文件夹上传 S3 上的 gulp 插件。

## 1. 使用方法
```js
var gulp = require('gulp');
var s3 = require('gulp-upload-s3');

gulp.task('s3', ()=>{
    gulp.src('./dest/**').pipe(s3({
        key:    '<access key id>',
        secret: '<secret access key>',
        region: '<region>', // 比如`cn-north-1`
        bucket: '<bucket name>',
    }));
});
```

## 2. 其他参数
1. `folder`: 上传到`bucket`中的某个文件夹中，比如`images/`.
2. `filter`: 仅仅上传满足条件的文件，比如匹配某个正则表达式，使得某个函数结果为真。
3. `reject`: 和`filter`作用相反，忽略满足条件的文件。
4. `params`: 对象，可以填写包括[`S3.upload`](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property)中第二个参数`options`中所有属性。

## 3. 参考资料
1. [适用于 Node.js 中 JavaScript 的 AWS 开发工具包](https://aws.amazon.com/cn/sdk-for-node-js/)
1. [AWS.S3 文档](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)