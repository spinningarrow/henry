var React = require('react');
var Post = require('./Post');
var PostList = require('./PostList');
var PostEditor = require('./PostEditor');
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

var hasReachedBottom = function (element) {
	return element.scrollTop + element.offsetHeight >= element.scrollHeight;
};

var PostBox = React.createClass({
	postsBatchSize: 15,

	getShallowPosts: function () {
		return qwest.get(url)
			.then(JSON.parse)
			.then(function (posts) {
				this._posts = posts;
			}.bind(this));
	},

	getFullPosts: function () {
		this.postsFetched = this.postsFetched || 0;

		if (this.postsFetched >= this._posts.length) return;

		if (this.postsFetched + this.postsBatchSize > this._posts.length) {
			this.postsBatchSize = this._posts.length - this.postsFetched;
		}

		var contentPromises = batchRequests(this._posts, this.postsFetched, this.postsBatchSize);

		contentPromises.map(function (contentPromise, index) {
			contentPromise.then(this.updateData);
		}.bind(this));

		this.postsFetched += this.postsBatchSize;
	},

	updateData: function (post) {
		var data = this.state.data;
		var foundIndex;

		this._posts.some(function (p, index) {
			return foundIndex = index, p.name === post.name;
		});
		post.isLoading = false;
		data[foundIndex] = post;

		this.setState({
			data: data
		});
	},

	generateSamplePosts: function () {
		var count = 0;

		return Array.apply(null, Array(this.postsBatchSize)).map(function () {
			return {
				isLoading: true,
				name: 'some-sample-post' + count++,
				title: 'SomeSamplePost',
				date: new Date(),
				body: 'Post body.'
			};
		});
	},

	handleScroll: function (event) {
		if (hasReachedBottom(event.target)
				&& this._posts
				&& this.postsFetched < this._posts.length) {
			console.log('Bottom reached!');
			var data = this.state.data;

			this.setState({
				data: data.concat(this.generateSamplePosts())
			});

			this.getFullPosts();
		}
	},

	handlePostClicked: function (post, event) {
		var foundPost = null;
		this.state.data.some(function (p) {
			return foundPost = p, p.name === post.name;
		});

		if (!foundPost) return;

		this.setState({
			selectedPost: foundPost
		});
	},

	handleTitleChanged: function (event) {
		var selectedPost = this.state.selectedPost;
		selectedPost.title = event.target.value;

		this.setState({
			selectedPost: selectedPost
		});
	},

	handleBodyChanged: function (event) {
		var selectedPost = this.state.selectedPost;
		selectedPost.body = event.target.value;

		this.setState({
			selectedPost: selectedPost
		});
	},

	getInitialState: function () {
		return {
			data: this.generateSamplePosts()
		};
	},

	componentDidMount: function () {
		this.getShallowPosts().then(function () {
			this.getFullPosts();
			setTimeout(this.getFullPosts, 5000);
		}.bind(this));
	},

	render: function () {
		// hax
		// document.querySelector('aside').addEventListener('scroll', this.handleScroll);
		return (
			<div className="post-box">
				<PostList posts={this.state.data} handlePostClicked={this.handlePostClicked}/>
				<PostEditor post={this.state.selectedPost} handleTitleChanged={this.handleTitleChanged} handleBodyChanged={this.handleBodyChanged}/>
			</div>
		);
	}
});

module.exports = PostBox;
