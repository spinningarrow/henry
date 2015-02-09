require('normalize-css');
React = require('react');

var Post = require('./Post');
var PostList = require('./PostList');
var PostBox = require('./PostBox');

React.render(<PostBox/>, document.querySelector('main'));
