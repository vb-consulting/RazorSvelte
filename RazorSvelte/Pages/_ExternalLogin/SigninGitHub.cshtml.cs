using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;
using RazorSvelte.Auth;

namespace RazorSvelte.Pages.ExternalLogin
{
    public class SigninGitHubModel : ExternalLoginModel
    {
        public SigninGitHubModel(IOptionsMonitor<GitHubConfig> config) : base(config.CurrentValue, ExternalType.GitHub) { }
    }
}
