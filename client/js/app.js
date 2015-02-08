require('normalize-css');
var React = require('react');
var qwest = require('qwest')

// var url = 'https://api.github.com/repos/spinningarrow/spinningarrow.github.io/contents/_posts';
var url = 'temp-posts.json';

var PostBox = React.createClass({
	getInitialState: function () {
		return { data: [] };
	},

	componentDidMount: function () {
		qwest.get(url)
			.then(function (response) {
				// console.log(response);
				console.log('posts gotten');
				this.setState({ data: JSON.parse(response) });
			}.bind(this));
	},

	render: function () {
		var array = [ 1, 2, 3, 4 ];
		return (
			<div className='posts-box'>
				<PostList posts={this.state.data}/>
			</div>
		);
	}
});

var PostList = React.createClass({
	render: function () {
		var nodes = this.props.posts.map(function (post) {
			return (
				<li><Post title={post.name} /></li>
			);
		});

		return (
			<ul>{nodes}</ul>
		);
	}
});

var Post = React.createClass({
	render: function () {
		return (
			<div>{this.props.title}</div>
		);
	}
});

React.render(<PostBox/>, document.querySelector('main'));
