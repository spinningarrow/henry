var React = require('react');

var PostEditor = React.createClass({
	render: function () {
		return (
			<div id="post-editor">
				<div>
					<input type="text" value="This is a title" placeholder="title"/>
				</div>
				<div>
					<textarea></textarea>
				</div>
				<div>
					<button type="submit">Publish</button>
				</div>
			</div>
		);
	}
});

module.exports = PostEditor;
