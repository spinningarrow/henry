require('normalize-css');
var React = require('react');

var Post = require('./Post');
var PostList = require('./PostList');
var PostBox = require('./PostBox');
var PostEditor = require('./PostEditor');

React.render(<PostBox/>, document.querySelector('#posts'));
React.render(<PostEditor/>, document.querySelector('#post-editor'));
