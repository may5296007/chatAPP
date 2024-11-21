const knex = require('knex')
const dbConnection = knex({
   client: 'mssql',
   connection: {
          user: 'soulaymane',
          password: 'sqlserver',
          server: 'SOULAYMANE',
          database: 'Magasin',
          options: {
              encrypt: true,
              trustServerCertificate: true,
          } 
   },

});

module.exports = dbConnection

/*
const knex = require('knex')
const dbConnection = knex({
   client: 'mssql',
   connection: {
          user: 'Tahmidul ',
          password: 'sqlserver',
          server: 'THX',
          database: 'Magasin',
          options: {
              encrypt: true,
              trustServerCertificate: true,
          } 
   },

});

module.exports = dbConnection
*/

/*
const knex = require('knex')
const dbConnection = knex({
   client: 'mssql',
   connection: {
          user: 'loic ',
          password: 'sqlserver',
          server: 'ARSON',
          database: 'Magasin',
          options: {
              encrypt: true,
              trustServerCertificate: true,
          } 
   },

});

module.exports = dbConnection
*/