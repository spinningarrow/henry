var Post = require('./Post');
var React = require('react');

var PostList = React.createClass({
	render: function () {
		var nodes = this.props.posts.map(function (post) {
			return (
				<li key={post.name}><Post title={post.title} date={post.date} /></li>
			);
		});

		return (
			<ul className="post-list">{nodes}</ul>
		);
	}
});

module.exports = PostList;
