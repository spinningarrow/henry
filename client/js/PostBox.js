var React = require('react');
var Post = require('./Post');
var PostList = require('./PostList');
var qwest = require('qwest');
var yaml = require('js-yaml');
var marked = require('marked');

var ACCESS_TOKEN = '';
var url = 'https://api.github.com/repos/spinningarrow/spinningarrow.github.io/contents/_posts?access_token=' + ACCESS_TOKEN;

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

// Gets the content for the provided list of (shallow) post objects
// Returns a list of promises for this operation
var fetchPostContent = function (posts) {
	return posts.map(function (post) {
		return qwest.get(post.url + '&access_token=' + ACCESS_TOKEN)
			.then(JSON.parse)
			.then(decodePostContent)
			.then(parsePostContent);
	});
};

// Takes in a list of all posts (shallow/full)
// Returns a list of posts which have content
// List returned increases in size with every request until all posts have been fetched
var batchRequests = function (posts, startIndex, batchSize) {
	batchSize = batchSize || 5;
	startIndex = startIndex || 0;

	// simple case, start from beginning and fetch <batchSize> number of posts
	var postsToFetch = posts.slice(startIndex, startIndex + batchSize);
	return fetchPostContent(postsToFetch);
};

var PostBox = React.createClass({
	postsBatchSize: 10,

	getShallowPosts: function () {
		return qwest.get(url)
			.then(JSON.parse)
			.then(function (posts) {
				this._posts = posts;
			}.bind(this));
	},

	getFullPosts: function () {
		this.postsFetched = this.postsFetched || 0;
		var contentPromises = batchRequests(this._posts, this.postsFetched, this.postsBatchSize);

		contentPromises.map(function (contentPromise, index) {
			contentPromise.then(this.updateData);
		}.bind(this));

		this.postsFetched += this.postsBatchSize;
	},

	updateData: function (post) {
		var data = this.state.data;
		var foundIndex;

		this._posts.filter(function (p, index) {
			return p.name === post.name && (foundIndex = index, true);
		});
		post.isLoading = false;
		data[foundIndex] = post;

		this.setState({
			data: data
		});
	},

	getInitialState: function () {
		var count = 0;
		var samplePostsLength = 20;

		return {
			data: Array.apply(null, Array(samplePostsLength)).map(function () {
				return {
					isLoading: true,
					name: 'some-sample-post' + count++,
					title: 'SomeSamplePost',
					date: new Date(),
					body: 'Post body.'
				};
			}),
			totalPosts: samplePostsLength,
			numPostsFetched: samplePostsLength
		};
	},

	componentDidMount: function () {
		this.getShallowPosts().then(function () {
			this.getFullPosts();
		}.bind(this));
	},

	render: function () {
		return (
			<div className='post-box'>
				<div><a href="#" onClick={this.getFullPosts}>More</a></div>
				<PostList posts={this.state.data}/>
			</div>
		);
	}
});

module.exports = PostBox;
