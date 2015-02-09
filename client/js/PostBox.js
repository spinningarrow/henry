var React = require('react');
var Post = require('./Post');
var PostList = require('./PostList');
var qwest = require('qwest');
var yaml = require('js-yaml');
var marked = require('marked');

// var url = 'https://api.github.com/repos/spinningarrow/spinningarrow.github.io/contents/_posts';
var url = 'temp-posts.json';

var decodePostContent = function (post) {
	// atob: to convert Base64 to human-readable stuff
	// escape + decodeURIComponent: for getting the UTF-8 characters right
	post.content = decodeURIComponent(escape(atob(post.content)));

	return post;
};

var parsePostContent = function (post) {
	var matches = post.content.match(/---((?:\n|.)+)---((?:\n|.)+)/);
	var yamlFrontMatter = matches && yaml.safeLoad(matches[1].trim());

	post.title = yamlFrontMatter.title;
	post.date =  yamlFrontMatter.date;
	post.body = matches && marked(matches[2].trim());

	return post;
};

var PostBox = React.createClass({
	getInitialState: function () {
		var count = 0;
		var samplePostsLength = 20;

		return {
			data: Array.apply(null, Array(samplePostsLength)).map(function () {
				return {
					name: 'some-sample-post' + count++,
					title: 'SomeSamplePost',
					date: new Date(),
					body: 'Post body.'
				};
			}),
			isLoading: true
		};
	},

	componentDidMount: function () {
		qwest.get(url)
			.then(JSON.parse)
			.then(function (posts) {
				var fullPostPromises = posts.map(function (post) {
					// return qwest.get(post.url);
					return qwest.get('temp-post-hny.json').then(JSON.parse)
						.then(decodePostContent)
						.then(parsePostContent);
				});

				Promise.all(fullPostPromises)
					.then(function (fullPosts) {
						this.setState({
							data: fullPosts.reverse(),
							isLoading: false
						});
					}.bind(this));
			}.bind(this));
	},

	render: function () {
		return (
			<div className={this.state.isLoading ? 'post-box is-loading' : 'post-box'}>
				<PostList posts={this.state.data}/>
			</div>
		);
	}
});

module.exports = PostBox;
