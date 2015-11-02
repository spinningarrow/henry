let React = require('react');
let Post = require('./Post');
let PostList = require('./PostList');
let PostEditor = require('./PostEditor');
let qwest = require('qwest');
let yaml = require('js-yaml');
let marked = require('marked');

let ACCESS_TOKEN = '';
let url = 'https://api.github.com/repos/spinningarrow/henry-test/contents/_posts?access_token=' + ACCESS_TOKEN;

let decodePostContent = function (post) {
	// atob: to convert Base64 to human-readable stuff
	// escape + decodeURIComponent: for getting the UTF-8 characters right
	post.content = decodeURIComponent(escape(atob(post.content)));

	return post;
};

let parsePostFilename = function (post) {
	let matches = post.name.match(/(\d{4}-\d{2}-\d{2})-(.+)\.m\w+/);

	return {
		date: matches[1] && new Date(matches[1]),
		title: matches[2] && matches[2].replace(/\b-\b/g, ' ').replace(/^(\w)/, function (match, firstLetter) {
			return firstLetter.toLocaleUpperCase();
		})
	}
};

let parsePostContent = function (post) {
	let matches = post.content.match(/---((?:\n|.)+)---((?:\n|.)+)/);
	let yamlFrontMatter = matches && yaml.safeLoad(matches[1].trim());

	post.title = yamlFrontMatter.title || parsePostFilename(post).title;
	post.date =  yamlFrontMatter.date || parsePostFilename(post).date;
	post.body = matches && /*marked(*/matches[2].trim()/*)*/;

	return post;
};

// Gets the content for the provided list of (shallow) post objects
// Returns a list of promises for this operation
let fetchPostContent = function (posts) {
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
let batchRequests = function (posts, startIndex, batchSize) {
	batchSize = batchSize || 5;
	startIndex = startIndex || 0;

	// simple case, start from beginning and fetch <batchSize> number of posts
	let postsToFetch = posts.slice(startIndex, startIndex + batchSize);
	return fetchPostContent(postsToFetch);
};

let hasReachedBottom = function (element) {
	return element.scrollTop + element.offsetHeight >= element.scrollHeight;
};

let PostBox = React.createClass({
	postsBatchSize: 15,

	getShallowPosts() {
		return qwest.get(url)
			.then(JSON.parse)
			.then(posts => this._posts = posts.reverse());
	},

	getFullPosts() {
		this.postsFetched = this.postsFetched || 0;

		if (this.postsFetched >= this._posts.length) return;

		if (this.postsFetched + this.postsBatchSize > this._posts.length) {
			this.postsBatchSize = this._posts.length - this.postsFetched;
		}

		let contentPromises = batchRequests(this._posts, this.postsFetched, this.postsBatchSize);

		contentPromises.forEach(contentPromise => contentPromise.then(this.updateData));

		this.postsFetched += this.postsBatchSize;
	},

	updateData(post) {
		let data = this.state.data;
		let foundIndex;

		this._posts.some(function (p, index) {
			return foundIndex = index, p.name === post.name;
		});
		post.isLoading = false;
		data[foundIndex] = post;

		this.setState({
			data: data
		});
	},

	generateSamplePosts() {
		let count = 0;

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

	handleScroll(event) {
		if (hasReachedBottom(event.target)
				&& this._posts
				&& this.postsFetched < this._posts.length) {
			console.log('Bottom reached!');
			let data = this.state.data;

			this.setState({
				data: data.concat(this.generateSamplePosts())
			});

			this.getFullPosts();
		}
	},

	handlePostClicked(post, event) {
		let foundPost = null;
		this.state.data.some(function (p) {
			return foundPost = p, p.name === post.name;
		});

		if (!foundPost) return;

		this.setState({
			selectedPost: foundPost
		});
	},

	handleTitleChanged(event) {
		let selectedPost = this.state.selectedPost;
		selectedPost.title = event.target.value;

		this.setState({
			selectedPost: selectedPost
		});
	},

	handleBodyChanged(event) {
		let selectedPost = this.state.selectedPost;
		selectedPost.body = event.target.value;

		this.setState({
			selectedPost: selectedPost
		});
	},

	getInitialState() {
		return {
			data: this.generateSamplePosts()
		};
	},

	componentDidMount: function () {
		this.getShallowPosts().then(() => {
			this.getFullPosts();
			setTimeout(this.getFullPosts, 5000);
		});
	},

	render() {
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
