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
    public class SigninLinkedInModel : ExternalLoginModel
    {
        public SigninLinkedInModel(IOptionsMonitor<LinkedInConfig> config) : base(config.CurrentValue, ExternalType.LinkedIn) { }
    }
}
