using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RazorSvelte.Auth;

namespace RazorSvelte.Controllers
{
    [Route("api")]
    [ApiController]
    public class ExternalLoginController : ControllerBase
    {
        private readonly ILogger<ExternalLoginController> logger;
        private readonly GoogleManager googleManager;
        private readonly LinkedInManager linkedInManager;
        private readonly GitHubManager gitHubAManager;
        private readonly JwtManager jwtManager;
        private readonly JwtConfig jwtConfig;

        public ExternalLoginController(
            ILogger<ExternalLoginController> logger,
            GoogleManager googleManager,
            LinkedInManager linkedInManager,
            GitHubManager gitHubAManager,
            JwtManager jwtManager,
            IOptionsMonitor<JwtConfig> jwtConfig)
        {
            this.logger = logger;
            this.googleManager = googleManager;
            this.linkedInManager = linkedInManager;
            this.gitHubAManager = gitHubAManager;
            this.jwtManager = jwtManager;
            this.jwtConfig = jwtConfig.CurrentValue;
        }

        [AllowAnonymous]
        [HttpPost("google-login")]
        public async ValueTask<ActionResult> GoogleLogin([FromBody] IDictionary<string, string> parameters)
        {
            return await ProcessExternalLoginAsync(googleManager, parameters);
        }

        [AllowAnonymous]
        [HttpPost("linkedin-login")]
        public async ValueTask<ActionResult> LinkedInLogin([FromBody] IDictionary<string, string> parameters)
        {
            return await ProcessExternalLoginAsync(linkedInManager, parameters);
        }

        [AllowAnonymous]
        [HttpPost("github-login")]
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

            var jwt = jwtManager.CreateJwtToken(response);
            Response.Cookies.Append(jwtConfig.CookieName, jwt, new CookieOptions
            {
                Path = "/",
                HttpOnly = true,
                Expires = DateTime.Now.AddMinutes(jwtConfig.CookieExpirationMin),
                IsEssential = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            });

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
