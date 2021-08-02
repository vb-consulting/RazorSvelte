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
    public class SigninGoogleModel : ExternalLoginModel
    {
        public SigninGoogleModel(IOptionsMonitor<GoogleConfig> config) : base(config.CurrentValue, ExternalType.Google) { }
    }
}
