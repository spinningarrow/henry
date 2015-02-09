var Post = require('./Post');
// var React = require('react');

var PostList = React.createClass({
	render: function () {
		var nodes = this.props.posts.map(function (post) {
			return (
				<li><Post title={post.name} content={post.content} /></li>
			);
		});

		return (
			<ul className="post-list">{nodes}</ul>
		);
	}
});

module.exports = PostList;
