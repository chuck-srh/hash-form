'use strict'
const knex = require('./lib/db');
const cors = require('@fastify/cors');
const hash = require('object-hash');

const initDB = async () => {
  if (!(await knex.schema.hasTable("test"))) {
    await knex.raw(`create table test (
      id uuid not null, 
      title varchar, 
      description varchar,
      section_a jsonb,
      section_a_hash varchar,
      section_b jsonb,
      section_b_hash varchar)`);

    await knex.raw(`insert into test (id, title, description, section_a, section_b)  values ('8ddb2069-6001-49d2-bf27-12d17ceefa40', 'Test 1', 'Desc 1', '{"fieldA1":"Value A1","fieldA2":"Value A2"}', '{"fieldB1":"Value B1","fieldB2":"Value B2"}')`)
  }
}
module.exports = function (fastify, options, next) {

  fastify.register(cors, {});

    fastify.get('/section/:id', async function(req, reply) {
      await initDB();

      const {id} = req.params;
      const existingRecord = await knex('test').where({id}).first();

      if (!existingRecord) {
        return reply.code(404).type('text/html').send('Not Found');
      }

      reply.send(existingRecord);
    });

    fastify.post('/section/:id', async function (req, reply) {
      //return reply.code(400).type('text/html').send('Stale data');

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
