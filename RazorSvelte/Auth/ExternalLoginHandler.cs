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
                ReturnError(response);
            }
        }
        catch (Exception e)
        {
            return ReturnError(e);
        }
        jwtManager.CreateJwtResponseFromExternalLogin(response, context.Response);
        return Results.Ok();
    }

    private IResult ReturnError(Exception e)
    {
        logger.LogError(e, "External login error: {0}", e.Message);
        return Results.BadRequest("Error trying to process external login request");
    }

    private IResult ReturnError(ExternalLoginResponse response)
    {
        logger.LogError("External login error. Response object: {0}", JsonSerializer.Serialize(response));
        return Results.BadRequest("Error trying to process external login request");
    }
}
