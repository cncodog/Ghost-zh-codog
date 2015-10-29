var request = require('request');
var qs = require('querystring');
var request = require('request');
var Models          = require('../models');
var _SERVER_HOST = 'http://dockerclub.net';
var _METHOD = 'POST';
var _HEADERS ={'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};

function ClubTopic(opts) {
    opts = opts || {};
    this.transport = opts.transport || null;
}


//在发布操作时发布帖子
ClubTopic.prototype.addTopic = function (userid,options,callback) {
  console.log(userid);





    return Models.User.findOne({id: userid}).then(function (result) {
        var post_data = {
                //如何处理访问id
                accesstoken:result.get('uuid'),
                title: options.get('title').trim(),
                tab: 'seminar',
                content:options.get('markdown').trim()
            };
          var tpMethod = '/api/v1/topics';
        return _request(tpMethod,post_data,callback,true);
      }, function () {
          return Promise.reject(new errors.NotFoundError('无法找到当前用户'));
      });



}



//在撤销操作时候，撤销帖子
ClubTopic.prototype.delTopic =function (userid,options,callback) {
  return Models.User.findOne({id: userid}).then(function (result) {
      var post_data = {
              //如何处理访问id
              accesstoken:result.get('uuid'),
              topic_id:options.get('topic_id').trim()
          };
        var tpMethod = '/api/v1/topic/de_collect';
      return _request(tpMethod,post_data,callback,true);
    }, function () {
        return Promise.reject(new errors.NotFoundError('无法找到当前用户'));
    });
}


function _request(tpMethod,data,callback,isDebug){
    var _URL = _SERVER_HOST + tpMethod;
    var objects = {
      method:_METHOD,//这里是发送的方法
      url: _URL,
      headers:_HEADERS,
      body: qs.stringify(data) //post的数据
    };
console.log(JSON.stringify(objects));

function callback(error, response, body) {
  //console.log("response"+JSON.stringify(response));
  console.log("error"+JSON.stringify(error));
  console.log("body"+JSON.stringify(body));
}
    request(objects, callback);
}

/**
ClubSync.prototype.postSync = function (options,callback) {


  return Models.User.findOne({id: options.author}).then(function (result) {

    return post(result.get('uuid'),options);

  }, function () {
      return Promise.reject(new errors.NotFoundError('无法找到当前用户'));
  });

}


function post(uuid,options){

    var url ='http://dockerclub.net/api/v1/topics';
    var post_data = {
            //如何处理访问id
            accesstoken:uuid,
            title: options.title,
            tab: 'seminar',
            content:options.markdown
        };
     console.log(JSON.stringify(post_data));
     var method ='post';
     var  header ={
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      };
      var objects = {
        method:'POST',//这里是发送的方法
        url: url,
        headers:header,
        body: qs.stringify(post_data) //post的数据
      };
      function callback(error, response, body) {
        //console.log("response"+JSON.stringify(response));
        console.log("error"+JSON.stringify(error));
        console.log("body"+JSON.stringify(body));
      }
      request(objects, callback);
}
**/


module.exports = new ClubTopic();
