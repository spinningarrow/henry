let React = require('react');

function PostEditor(props) {
	return (
		<div id="post-editor">
			<form className="text-editor-form">
				<input type="text"
					className="text-editor-title"
					placeholder="Title"
					value={props.post && props.post.title}
					onChange={props.handleTitleChanged}/>
				<textarea className="text-editor"
					value={props.post && props.post.body}
					onChange={props.handleBodyChanged}></textarea>
				<div>
					<button type="submit">Publish</button>
				</div>
			</form>
		</div>
	);
}

module.exports = PostEditor;
