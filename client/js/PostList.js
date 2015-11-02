let Post = require('./Post');
let React = require('react');

function PostList(props) {
	let nodes = props.posts.map(post => (
		<li key={post.name}
			className={post.isLoading ? 'is-loading' : ''}
			onClick={props.handlePostClicked.bind(null, post)}>
			<Post title={post.title} date={post.date} />
		</li>
	));

	return (
		<div id="post-list">
			<ul className="list-boxes">{nodes}</ul>
		</div>
	);
}

module.exports = PostList;
