using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;

namespace RazorSvelte.Auth;

public class RefreshTokenRepository
{
    private static readonly ConcurrentDictionary<string, (string refresh, DateTime expiry)> _dict = new();

    public RefreshTokenRepository()
    {
    }

    public void AddOrUpdate(JwtSecurityToken token, string refresh, DateTime expiry)
    {
        _dict.AddOrUpdate(token.Id, (refresh, expiry), (id, _) => (refresh, expiry));
    }

    public void Remove(JwtSecurityToken token)
    {
        _dict.TryRemove(token.Id, out var _);
    }

    public (string? refresh, DateTime? expiry) Get(JwtSecurityToken token)
    {
        if (_dict.TryGetValue(token.Id, out var value))
        {
            return value;
        }
        return (null, null);
    }
}
