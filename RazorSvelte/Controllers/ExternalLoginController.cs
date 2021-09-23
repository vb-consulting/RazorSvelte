using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RazorSvelte.Auth;

namespace RazorSvelte.Controllers
{
    [ApiController]
    public class ExternalLoginController : ControllerBase
    {
        private readonly ILogger<ExternalLoginController> logger;
        private readonly GoogleManager googleManager;
        private readonly LinkedInManager linkedInManager;
        private readonly GitHubManager gitHubAManager;
        private readonly JwtManager jwtManager;

        public ExternalLoginController(ILogger<ExternalLoginController> logger, GoogleManager googleManager, LinkedInManager linkedInManager, GitHubManager gitHubAManager, JwtManager jwtManager)
        {
            this.logger = logger;
            this.googleManager = googleManager;
            this.linkedInManager = linkedInManager;
            this.gitHubAManager = gitHubAManager;
            this.jwtManager = jwtManager;
        }

        [AllowAnonymous]
        [HttpPost(Urls.LoginGoogleUrl)]
        public async ValueTask<ActionResult> GoogleLogin([FromBody] IDictionary<string, string> parameters)
        {
            return await ProcessExternalLoginAsync(googleManager, parameters);
        }

        [AllowAnonymous]
        [HttpPost(Urls.LoginLinkedInUrl)]
        public async ValueTask<ActionResult> LinkedInLogin([FromBody] IDictionary<string, string> parameters)
        {
            return await ProcessExternalLoginAsync(linkedInManager, parameters);
        }

        [AllowAnonymous]
        [HttpPost(Urls.LoginGitHubUrl)]
        public async ValueTask<ActionResult> GitHubLogin([FromBody] IDictionary<string, string> parameters)
        {
            return await ProcessExternalLoginAsync(gitHubAManager, parameters);
        }

        private async ValueTask<ActionResult> ProcessExternalLoginAsync(ExternalLoginManager manager, IDictionary<string, string> parameters)
        {
            ExternalLoginResponse response;
            try
            {
                response = await manager.ProcessAsync(parameters, Request);
                if (response.HasError)
                {
                    return LogBadRequest(response.Error);
                }
            }
            catch (Exception e)
            {
                return LogBadRequest(e);
            }
            jwtManager.CreateJwtResponseFromExternalLogin(response, Response);
            return Ok();
        }

        private BadRequestObjectResult LogBadRequest(Exception e)
        {
            logger.LogError(e, "External login error: {0}", e.Message);
            return BadRequest("Error trying to process external login request");
        }

        private BadRequestObjectResult LogBadRequest(string msg)
        {
            logger.LogError("External login error: {0}", msg);
            return BadRequest("Error trying to process external login request");
        }
    }
}
