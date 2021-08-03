using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using RazorSvelte.Auth;

namespace RazorSvelte.Pages.ExternalLogin
{
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    [IgnoreAntiforgeryToken]
    [AllowAnonymous]
    public abstract class ExternalLoginModel : PageModel
    {
        private readonly ExternalLoginConfig config;

        public string State { get; private set; }
        public string AuthUrl { get; private set; }
        public string LoginUrl { get; private set; }
        public ExternalType ExternalType { get; private set; }

        public ExternalLoginModel(ExternalLoginConfig config, ExternalType type)
        {
            this.config = config;
            ExternalType = type;
            State = Guid.NewGuid().ToString();
            LoginUrl = config.LoginUrl;
        }

        public void OnGet()
        {
            var redirectUrl = $"{Request.Scheme}://{Request.Host}{config.RedirectPath}";
            AuthUrl = string.Format(config.AuthUrl, config.ClientId, redirectUrl, State);
        }
    }
}
