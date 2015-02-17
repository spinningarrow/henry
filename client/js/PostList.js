var Post = require('./Post');
var React = require('react');

var PostList = React.createClass({
	render: function () {
		var nodes = this.props.posts.map(function (post) {
			return (
				<li key={post.name} className={post.isLoading ? 'is-loading' : ''}><Post title={post.title} date={post.date} /></li>
			);
		});

		return (
			<div id="post-list">
				<ul className="list-boxes">{nodes}</ul>
			</div>
		);
	}
});

module.exports = PostList;
