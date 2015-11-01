require('normalize-css');
var React = require('react');
var ReactDOM = require('react-dom');

var Post = require('./Post');
var PostList = require('./PostList');
var PostBox = require('./PostBox');
var PostEditor = require('./PostEditor');

ReactDOM.render(<PostBox/>, document.querySelector('main'));
