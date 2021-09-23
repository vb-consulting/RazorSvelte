using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;
using RazorSvelte.Auth;

namespace RazorSvelte.Pages
{
    public class LogoutModel : PageModel
    {
        private readonly JwtConfig jwtConfig;

        public LogoutModel(IOptionsMonitor<JwtConfig> jwtConfig)
        {
            this.jwtConfig = jwtConfig.CurrentValue;
        }

        public void OnGet()
        {
            if (!Request.Cookies.ContainsKey(jwtConfig.CookieName))
            {
                return;
            }
            Response.Cookies.Delete(jwtConfig.CookieName);
            Response.Redirect(Urls.IndexUrl);
        }
    }
}
