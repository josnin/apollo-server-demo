const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const fetch = require('node-fetch');


// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    getPerson(id: Int!): Person
  }

  type Film {
    title: String
    episode_id: Int
    opening_crawl: String
    director: String
    producer: String
    release_date: String
  
  }

  type Person {
    name: String
    height: String
    mass: String
    hair_color: String
    skin_color: String
    eye_color: String
    birth_year: String
    gender: String
    films: [Film]
  }

`;

// Provide resolver functions for your schema fields
const resolvers = {
  Person: {
    films: (parent) => {
        const promises = parent.films.map( async url => {
            const response = await fetch(url);
            return response.json();
        });

        return Promise.all(promises);
    }
  },

  Query: {
    hello: () => 'Hello world!',
    getPerson: async (_, { id }) => {
        const response = await fetch(`https://swapi.co/api/people/${id}/`)
        return response.json();
    }
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);
