var React = require('react');
var moment = require('moment');

// Usage: <Post title={title} date={date}/>
var Post = React.createClass({
	render: function () {
		return (
			<div className="post">
				<h2>{this.props.title}</h2>
				<time>{moment(this.props.date).fromNow()}</time>
			</div>
		);
	}
});

module.exports = Post;
