'use strict'
const knex = require('./lib/db');

module.exports = function (fastify, options, next) {

    fastify.get('/', async function (req, reply) {
      console.log(knex);

      let x = await knex.raw('select * from test');
      reply.send(x.rows);
    })
    next()
  }
