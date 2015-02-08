require('normalize-css');
var React = require('react');
var qwest = require('qwest');
var marked = require('marked');
var yaml = require('js-yaml');

// var url = 'https://api.github.com/repos/spinningarrow/spinningarrow.github.io/contents/_posts';
var url = 'temp-posts.json';

var parsePost = function (postContent) {
	var frontMatterEndIndex = postContent.lastIndexOf('---') + 3;

	return {
		meta: yaml.safeLoad(postContent.substring(3, frontMatterEndIndex - 3)),
		body: marked(postContent.substring(frontMatterEndIndex))
	};
}

var PostBox = React.createClass({
	getInitialState: function () {
		return { data: [] };
	},

	componentDidMount: function () {
		qwest.get(url)
			.then(JSON.parse)
			.then(function (posts) {
				var fullPostPromises = posts.map(function (post) {
					// return qwest.get(post.url);
					return qwest.get('temp-post-hny.json').then(JSON.parse);
				});

				Promise.all(fullPostPromises)
					.then(function (fullPosts) {
						this.setState({ data: fullPosts });
					}.bind(this));
			}.bind(this));
	},

	render: function () {
		return (
			<div className='post-box'>
				<PostList posts={this.state.data}/>
			</div>
		);
	}
});

var PostList = React.createClass({
	render: function () {
		var nodes = this.props.posts.map(function (post) {
			return (
				<li><Post title={post.name} content={post.content} /></li>
			);
		});

		return (
			<ul className="post-list">{nodes}</ul>
		);
	}
});

var Post = React.createClass({
	getPostMeta: function () {
		return parsePost(atob(this.props.content)).meta;
	},

	render: function () {
		return (
			<div className="post">
				<h2>{this.getPostMeta().title}</h2>
				<time>{this.getPostMeta().date.toDateString()}</time>
			</div>
		);
	}
});

React.render(<PostBox/>, document.querySelector('main'));
