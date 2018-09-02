const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer } = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe("Blog Posts", function () {

	before(function() {
		return runServer();
	});
	after(function() {
		return closeServer();
	});

	it("should return list of blog posts on GET request", function() {
		return chai.request(app).get("/blog-posts").then(function(res){
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.a('array');
			expect(res.body.length).to.be.at.least(1);
			const expectedKeys = ['id', 'author', 'content','publishDate', 'title'];
			res.body.forEach(function(item) {
				expect(item).to.be.a('object');
				expect(item).to.include.keys(expectedKeys);
			});
		});});
	it("should add JSON item on Post", function() {
		const newItem = {author: "New Author", content: "blah blah blah", title: "Foo Bars sound yummy"};
		return chai.request(app).post('/blog-posts').send(newItem).then(function(res) {
			expect(res).to.have.status(201);
			expect(res).to.be.json;
			expect(res.body).to.be.a('object')
			expect(res.body).to.include.keys('id', 'author', 'content','publishDate', 'title');
			expect(res.body.id).to.not.equal(null);
			expect(res.body).to.deep.equal(
				Object.assign(newItem, {id: res.body.id, publishDate: res.body.publishDate })
				);
		});});
	it("should update items with PUT", function() {
		const updateData = {
			title: "foo",
			author: "bar"
		};
		chai.request(app).get('/blog-posts').then(function(res) {
			const updateData = Object.assign(res.body[0], updateData);
			return chai.request(app).put(`/blog-posts/${updateData.id}`).send(updateData).then(function(res) {expect(res).to.have.status(204);
			}
			)
		});
	});
		

	it('should delete item on DELETE', function() {
		return chai.request(app).get('/blog-posts').then(function(res) {
			return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
		}).then(function(res) {
			expect(res).to.have.status(204);
		})});
});
