"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.post.search(ctx.query);
    } else {
      entities = await strapi.services.post.find(ctx.query);
    }

    return entities.map((entity) => {
      const post = sanitizeEntity(entity, {
        model: strapi.models.post,
      });
      if (post.users_permissions_user) {
        post.users_permissions_user = {
          id: post.users_permissions_user.id,
          username: post.users_permissions_user.username,
        };
      }
      return post;
    });
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.post.findOne({ id });
    const post = sanitizeEntity(entity, { model: strapi.models.post });

    post.users_permissions_user = {
      id: post.users_permissions_user.id,
      username: post.users_permissions_user.username,
    };
    return post;
  },
};
