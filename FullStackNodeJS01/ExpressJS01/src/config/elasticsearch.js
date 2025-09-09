const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
    node: 'http://localhost:9200', // ES của bạn (Docker)
});

module.exports = esClient;