using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;

namespace RazorSvelte.Pages
{
    [Authorize]
    public class AuthorizedPageModel : PageModel
    {
        public string UserValues { get; private set; }

        public void OnGet()
        {
            UserValues = JsonConvert.SerializeObject(new
            {
                name = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value,
                email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value,
                timezone = User.Claims.FirstOrDefault(c => c.Type == "timezone")?.Value,
                timestamp = User.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.AuthTime)?.Value
            });
        }
    }
}
