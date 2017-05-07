const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {BlogPosts} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function seedBlogPostData() {
	console.info('seeding blogPost data');
	const seedData = [];

	for (let i=1; i<=10; i++) {
		seedData.push(generateBlogPostData();)
	}
	return BlogPosts.insertMany(seedData);
}
//title content author
function generateTitle() {
	const title = [
	'Title 1', 'Title 2', 'Title 3', 'Title 4']
	return title[Math.floor(Math.random() * title.length)];
	
}

function generateContent() {
	const content = ['Lorem', 'Ipsum', 'Lorem Ipsum'];
	return content[Math.floor(Math.random() * content.length)];
}

function generateAuthor() {
	const author = ['Sally A', 'Sally B', 'Sally C'];
	return author = author[Math.floor(Math.random() * author.length)];
	
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('BlogPosts API resource', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});
beforeEach(function() {
	return seedBlogPostData();
});

afterEach(function() {
	return tearDownDb();
});

after(function() {
	return closeServer();
})

describe('GET endpoint', function() {
	it('should return all existing BlogPosts', function() {
		let res;
		return chai.request(app)
		.get('/blogPosts')
		.then(function(_res) {
			res = _res;
			res.should.have.status(200);
			res.body.blogPosts.should.have.length.of.at.least(1);
			return BlogPosts.count();
		})
		.then(function(count) {
			res.body.blogPosts.should.have.length.of(count);
		});
	});

	it('should return blogPosts with right fields', function() {

		let resBlogPost;
		return chai.request(app)
		.get('/blogPosts')
		.then(function(rest) {
			res.should.have.status(200);
			res.should.be.json;
			res.body.blogPosts.should.be.a('array');
			res.body.blogPosts.should.have.length.of.at.least(1);

			res.body.blogPosts.forEach(function(blogPost) {
				blogPost.should.be.a('object');
				blogPost.should.include.keys(
					'title', 'content', 'author');
			});
			resBlogPost = res.body.blogPosts[0];
			return BlogPosts.findById(resBlogPost.id);
		})
		.then(function(restaurant) {

			resBlogPost.title.should.equal(blogPost.title);
			resBlogPost.content.should.equal(blogPost.content);
			resBlogPost.author.should.equal(blogPost.author);
		});
	});
});

describe('POST endpoint', function() {

	it('should add a new blogPost', function() {

		const newBlogPost = generateBlogPostData();
		let mostRecent//??????;

		return chai.request(app)
			.post('/blogPosts')
			.send(newBlogPost)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys(
					'title', 'content', 'author');
				res.body.title.should.equal(newBlogPost.title);
				res.body.content.should.equal(newBlogPost.content);
				res.body.author.should.equal(newBlogPost.author);
				return BlogPost.findById(res.body.id);
			  })
			.then(function(blogPost) {
				blogPost.title.should.equal(newBlogPost.title);
				blogPost.content.should.equal(newBlogPost.content);
				blogPost.author.should.equal(newBlogPost.author);
			});
		});
	});

describe('PUT endpoint', function() {

	it('should update fields you send over', function() {
		const updateData = {
			title: 'Title 1',
			content: 'Lorem Ipsum',
			author: 'Sally B'

		};

		return BlogPost
		.findOne()
		.exec()
		.then(function(blogPost) {
			updateData.id = blogPost.id;

			return chai.request(app)
				.put(`/blogPosts/${blogPosts.id}`)
				.send(updateData);

		})
		.then(function(res) {
			res.should.have.status(204);

			return BlogPost.findById(updateData.id).exec();
		});
	});
});

describe('DELETE endpoint', function() {

	it('delete a blogPost by id', function() {

		let blogPost;

		return BlogPost
		.findOne()
		.exec()
		.then(function(_blogPost) {
			blogPost = _blogPost;
			return chai.request(app).delete(`/blogPost/${blogPost.id}`);
		})
		.then(function(res) {
			res.should.have.status(204);
			return BlogPost.findById(blogPost.id).exec();

		})
		.then(function(_blogPost) {
			should.not.exist(_blogPost);
		});
	});
});
});
