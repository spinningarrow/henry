var React = require('react');

var PostEditor = React.createClass({
	render: function () {
		return (
			<div id="post-editor">
				<form className="text-editor-form">
					<input type="text" className="text-editor-title" defaultValue="This is a title" placeholder="title"/>
					<textarea className="text-editor"></textarea>
				</form>
			</div>
		);
	}
});

module.exports = PostEditor;
