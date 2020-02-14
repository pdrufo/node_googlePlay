'use strict';

const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('Express App', () => {
  it('should return a message from GET /', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Welcome');
  });
});

describe('GET /apps', () => {
  it('should return an array of apps from the playstore', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const app = res.body[0];
        expect(app).to.include.all.keys('App', 'Category', 'Rating', 'Reviews', 'Size', 'Installs', 'Type', 'Price', 'Content Rating', 'Genres', 'Last Updated', 'Current Ver', 'Android Ver');
      });
  });
  it('should be 400 if sort is incorrect', () => {
    return supertest(app)
      .get('/apps')
      .query({sort: 'WRONG'})
      .expect(400, 'Sort must be one of rating or app');
  });

  it('should sort by Rating', () => {
    return supertest(app)
      .get('/apps')
      .query({sort: 'Rating'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        expect(sorted).to.be.true;
        while(sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].Rating < res.body[i + 1].Rating;
          i++;
        }
      });
  });
});