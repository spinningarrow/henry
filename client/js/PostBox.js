var React = require('react');
var Post = require('./Post');
var qwest = require('qwest');

// var url = 'https://api.github.com/repos/spinningarrow/spinningarrow.github.io/contents/_posts';
var url = 'temp-posts.json';

var PostBox = React.createClass({
	getInitialState: function () {
		// return { data: [] };
		var samplePost = {
			'name': 'something',
			'content': btoa('---\ntitle: SamplePost\ndate: ' + new Date().toISOString() + '\n---')
		};

		return { data: Array.apply(null, Array(20)).map(function () { return samplePost; }), loading: true };
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
						this.setState({ data: fullPosts.reverse(), loading: false });
					}.bind(this));
			}.bind(this));
	},

	render: function () {
		return (
			<div className={this.state.loading ? 'post-box is-loading' : 'post-box'}>
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

module.exports = PostBox;
