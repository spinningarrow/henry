var React = require('react');
var yaml = require('js-yaml');
var marked = require('marked');
var moment = require('moment');

var parsePost = function (postContent) {
	var frontMatterEndIndex = postContent.lastIndexOf('---') + 3;

	return {
		meta: yaml.safeLoad(postContent.substring(3, frontMatterEndIndex - 3)),
		body: marked(postContent.substring(frontMatterEndIndex))
	};
};

var Post = React.createClass({
	getPostMeta: function () {
		return parsePost(decodeURIComponent(escape(atob(this.props.content)))).meta;
	},

	render: function () {
		return (
			<div className="post">
				<h2>{this.getPostMeta().title}</h2>
				<time>{this.getPostMeta().date && moment(this.getPostMeta().date).fromNow()}</time>
			</div>
		);
	}
});

module.exports = Post;
