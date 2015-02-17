var React = require('react');

var PostEditor = React.createClass({
	render: function () {
		return (
			<div id="post-editor">
				<form className="text-editor-form">
					<input type="text"
						className="text-editor-title"
						placeholder="Title"
						value={this.props.post && this.props.post.title}
						onChange={this.props.handleTitleChanged}/>
					<textarea className="text-editor"
						value={this.props.post && this.props.post.body}
						onChange={this.props.handleBodyChanged}></textarea>
				</form>
			</div>
		);
	}
});

module.exports = PostEditor;
