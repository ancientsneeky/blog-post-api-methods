const express = require("express");
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { BlogPosts } = require("./models");

// convenience function for generating lorem text for blog
// posts we initially add below
function lorem() {
  return (
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod " +
    "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, " +
    "quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo " +
    "consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse " +
    "cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non " +
    "proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  );
}

// seed some posts so initial GET requests will return something
BlogPosts.create("10 things -- you won't believe #4", lorem(), "Billy Bob");
BlogPosts.create("Lions and tigers and bears oh my", lorem(), "Lefty Lil");

// add endpoint for GET. It should call `BlogPosts.get()`
// and return JSON objects of stored blog posts.
// send back JSON representation of all blog posts
// on GET requests to root

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
	console.log(BlogPosts)
});

// add endpoint for POST requests, which should cause a new
// blog post to be added (using `BlogPosts.create()`). It should
// return a JSON object representing the new post (including
// the id, which `BlogPosts` will create. This endpoint should
// send a 400 error if the post doesn't contain
// `title`, `content`, and `author`

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['author','title', 'content', 'author',]
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const errMessage = `missing ${field} in request body`;
			console.error(errMessage);
			res.status(400).send(errMessage);		
		}
	}
	const rb = req.body;
	const newPost = BlogPosts.create(rb.title, rb.content, rb.author);
	res.status(201).json(newPost);
});

// add endpoint for PUT requests to update blogposts. it should
// call `BlogPosts.update()` and return the updated post.
// it should also ensure that the id in the object representing
// the post matches the id of the path variable, and that the
// following required fields are in request body: `id`, `title`,
// `content`, `author`, `publishDate`

router.put('/:id', (req, res) => {
	const requiredFields = ["id", "title", "author", "content", "publishDate"];
	for(let i = 0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const errMessage = `missing ${field} in request body`;
			console.error(errMessage);
			return res.status(400).send(errMessage);
		}
	}
	if (req.params.id !== req.body.id) {
		const errMessage = `Request path id ${req.params.id} and request body id ${req.body.id} must match`;
    	console.error(errMessage);
		return res.status(400).send(errMessage);
	}
	const updatedPost = {
		id: req.params.id,
	    title: req.body.title,
	    content: req.body.content,
	    author: req.body.author,
		publishDate: req.body.publishDate
	}
	BlogPosts.update(updatedPost);
	console.log(`Updating ${req.params.id}`);
	res.send(204).end();
});

// add endpoint for DELETE requests. These requests should
// have an id as a URL path variable and call
// `BlogPosts.delete()`
router.delete('/:id', (req, res) => {
	console.log(`Deleteing post with ${req.params.id}`);
	BlogPosts.delete(req.params.id);
	res.status(204).end();
});

module.exports = router;