'use strict'
const knex = require('./lib/db');
const cors = require('@fastify/cors');
const hash = require('object-hash');


module.exports = function (fastify, options, next) {

  fastify.register(cors, {});

    fastify.get('/section/:id', async function(req, reply) {
      const {id} = req.params;
      const existingRecord = await knex('test').where({id}).first();

      if (!existingRecord) {
        return reply.code(404).type('text/html').send('Not Found');
      }

      reply.send(existingRecord);
    });

    fastify.post('/section/:id', async function (req, reply) {
      return reply.code(400).type('text/html').send('Stale data');

      const { id } = req.params;
      const { column, data, hashval } = req.body;

      //test for existing record to return a 404 if there is no matching id
      const existingRecord = await knex('test').where({id}).first();
      if (!existingRecord) {
        return reply.code(404).type('text/html').send('Not Found');
      }

      const affectedRows = await knex('test')
        .update(column, data)
        .update(`${column}_hash`, hash(data))
        .where(`${column}_hash`, hashval);

      if (affectedRows === 0) {
        return reply.code(400).type('text/html').send('Stale data');
      }

      reply.type('text/html').send('Ok');
    })
    next()
  }
