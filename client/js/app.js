require('normalize-css');
var React = require('react');

var Post = require('./Post');
var PostBox = require('./PostBox');

React.render(<PostBox/>, document.querySelector('main'));
