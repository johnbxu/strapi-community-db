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

  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.author = ctx.state.user.id;
      entity = await strapi.services.post.create(data, { files });
    } else {
      ctx.request.body.author = ctx.state.user.id;
      entity = await strapi.services.post.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.post });
  },

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [post] = await strapi.services.post.find({
      id: ctx.params.id,
      "author.id": ctx.state.user.id,
    });

    if (!post) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.post.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.post.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.post });
  },

  async delete(ctx) {
    const { id } = ctx.params;

    let entity;

    const [post] = await strapi.services.post.find({
      id: ctx.params.id,
      "author.id": ctx.state.user.id,
    });

    if (!post) {
      return ctx.unauthorized(`You can't delete this entry`);
    }

    entity = await strapi.services.post.delete({ id });

    return sanitizeEntity(entity, { model: strapi.models.post });
  },
};
