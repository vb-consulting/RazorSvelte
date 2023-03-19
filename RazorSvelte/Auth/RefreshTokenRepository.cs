using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;

namespace RazorSvelte.Auth;

public class RefreshTokenRepository
{
    private static readonly ConcurrentDictionary<string, (string refresh, DateTime expiry)> Dict = new();

    public RefreshTokenRepository()
    {
    }

    public void AddOrUpdate(JwtSecurityToken token, string refresh, DateTime expiry)
    {
        Dict.AddOrUpdate(token.Id, (refresh, expiry), (id, _) => (refresh, expiry));
    }

    public void Remove(JwtSecurityToken token)
    {
        Dict.TryRemove(token.Id, out var _);
    }

    public (string? refresh, DateTime? expiry) Get(JwtSecurityToken token)
    {
        if (Dict.TryGetValue(token.Id, out var value))
        {
            return value;
        }
        return (null, null);
    }
}
