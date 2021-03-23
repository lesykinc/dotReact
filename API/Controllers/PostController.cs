﻿using System;
using System.Threading.Tasks;
using Application.Core;
using Application.Posts;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetPosts([FromQuery]PagingParams param)
        {
            return HandlePagedResult(await Mediator.Send(new List.Query{Params = param}));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost(Post post)
        {
            return HandleResult(await Mediator.Send(new Create.Command {Post = post}));
        }
        
        [Authorize(Policy = "IsPostAuthor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditPost(Guid id, Post post)
        {
            post.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command {Post = post}));
        }

        [Authorize(Policy = "IsPostAuthor")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command {Id = id}));
        }
        
        [HttpGet ("search")]
        public async Task<IActionResult> SearchPost(string search)
        {
            return HandleResult(await Mediator.Send(new Search.Query{Search = search}));

        }
    }
}