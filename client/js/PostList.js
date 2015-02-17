var Post = require('./Post');
var React = require('react');

var PostList = React.createClass({
	render: function () {
		var nodes = this.props.posts.map(function (post) {
			return (
				<li key={post.name}
					className={post.isLoading ? 'is-loading' : ''}
					onClick={this.props.handlePostClicked.bind(null, post)}>
					<Post title={post.title} date={post.date} />
				</li>
			);
		}.bind(this));

		return (
			<div id="post-list">
				<ul className="list-boxes">{nodes}</ul>
			</div>
		);
	}
});

module.exports = PostList;
