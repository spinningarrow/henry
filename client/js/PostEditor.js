var React = require('react');

var PostEditor = React.createClass({
	handleChange: function (event) {
	},

	render: function () {
		return (
			<div id="post-editor">
				<form className="text-editor-form">
					<input type="text"
						className="text-editor-title"
						placeholder="Title"
						value={this.props.post && this.props.post.title}
						onChange={this.handleChange}/>
					<textarea className="text-editor"
						value={this.props.post && this.props.post.content}
						onChange={this.handleChange}></textarea>
				</form>
			</div>
		);
	}
});

module.exports = PostEditor;
