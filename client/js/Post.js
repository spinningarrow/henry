let React = require('react');
let moment = require('moment');

// Usage: <Post title={title} date={date}/>
function Post(props) {
	return (
		<div className="post">
			<h2>{props.title}</h2>
			<span className="meta"><time>{moment(props.date).fromNow()}</time></span>
		</div>
	);
}

module.exports = Post;
