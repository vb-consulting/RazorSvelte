namespace RazorSvelte.Auth;

public class ExternalLoginHandler
{
    private readonly JwtManager jwtManager;
    private readonly ILogger<ExternalLoginHandler> logger;

    public ExternalLoginHandler(JwtManager jwtManager, ILogger<ExternalLoginHandler> logger)
    {
        this.jwtManager = jwtManager;
        this.logger = logger;
    }

    public async ValueTask<IResult> ProcessExternalLoginAsync(HttpContext context, ExternalLoginManager manager, IDictionary<string, string> parameters)
    {
        ExternalLoginResponse response;
        try
        {
            response = await manager.ProcessAsync(parameters, context.Request);
            if (response.HasError)
            {
                logger.LogError("External login error: {0}", response.Error);
                return Results.BadRequest("Error trying to process external login request");
            }
        }
        catch (Exception e)
        {
            logger.LogError(e, "External login error: {0}", e.Message);
            return Results.BadRequest("Error trying to process external login request");
        }
        jwtManager.CreateJwtResponseFromExternalLogin(response, context.Response);
        return Results.Ok();
    }
}
