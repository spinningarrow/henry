var React = require('react');

var PostEditor = React.createClass({
	render: function () {
		return (
			<div className="post-editor">
				<h2>This is a title</h2>
				<textarea></textarea>
				<button type="submit">Publish</button>
			</div>
		);
	}
});

module.exports = PostEditor;
