namespace RazorSvelte.Auth;

public class ExternalLoginHandler
{
    private readonly JwtManager _jwtManager;
    private readonly ILogger<ExternalLoginHandler> _logger;

    public ExternalLoginHandler(JwtManager jwtManager, ILogger<ExternalLoginHandler> logger)
    {
        this._jwtManager = jwtManager;
        this._logger = logger;
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
        _jwtManager.CreateJwtResponseFromExternalLogin(response, context.Response);
        return Results.Ok();
    }

    private IResult ReturnError(Exception e)
    {
        _logger.LogError(e, "External login error: {0}", e.Message);
        return Results.BadRequest("Error trying to process external login request");
    }

    private IResult ReturnError(ExternalLoginResponse response)
    {
        _logger.LogError("External login error. Response object: {0}", JsonSerializer.Serialize(response));
        return Results.BadRequest("Error trying to process external login request");
    }
}
