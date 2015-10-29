
/*  第三方论坛集成
    */

var Models          = require('../models');
var rp = require('request-promise');

var ADD_TOPIC_URL = 'http://dockerclub.net/api/v1/topics';
var DEL_TOPIC_URL ='http://dockerclub.net/api/v1/topic/de_collect';

function ThirdTopics () {
}


ThirdTopics.prototype.addTopic = function (post,uid) {

  return Models.User.findOne({id: uid}).then(function (result) {
        //定义数据
        var options = {
          method: 'POST',
          uri: ADD_TOPIC_URL,
          form: {
            accesstoken:result.get('uuid'),
            title: post.get('title'),
            tab: 'seminar',
            content:post.get('markdown')

          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
        return rp(options)
          .then(function (body) {
              console.log('同步失败' + body);
              return eval('(' + body + ')');
          })
          .catch(function (err) {
              return eval('{success:false}');
            console.log('同步失败' + err);
        });
  }, function () {
      return Promise.reject(new errors.NotFoundError('无法找到当前用户'));
  });

}



/**
ThirdTopics.prototype.delTopic = function(postid,uid){


  return Models.User.findOne({id: uid}).then(function (result) {
        //定义数据
        var _options = {
          method: 'POST',
          uri: DEL_TOPIC_URL,
          form: {
            accesstoken:result.get('uuid'),
            topic_id:postid
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
        return rp(_options)
          .then(function (body) {
              console.log('同步失败' + body);
              return eval('(' + body + ')');
          })
          .catch(function (err) {
          //  return eval('(' + 'success:false,topic_id:'+ ')');
          console.log('同步失败' + err);
        });
  }, function () {
      return Promise.reject(new errors.NotFoundError('无法找到当前用户'));
  });

}**/


module.exports = new  ThirdTopics();
