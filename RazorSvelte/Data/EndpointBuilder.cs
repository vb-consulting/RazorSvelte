using System.Net.Mime;
using Microsoft.AspNetCore.Authorization;

namespace RazorSvelte.Data;

public static class EndpointBuilder
{
    public static void ConfigureEndpoints(this WebApplicationBuilder builder)
    {
        //
        // nothing to configure...
        //
    }

    public static void UseEndpoints(this WebApplication app)
    {
        app.MapGet(Urls.Chart1Url, [AllowAnonymous] (HttpResponse response) =>
        {
            response.ContentType = MediaTypeNames.Application.Json;
            return @"{""labels"" : [""Business Analyst"",""Database Administrator"",""Database Developer"",""Devops"",""Devops Engineer"",""Devops Lead"",""Product Owner"",""Project Manager"",""QA Engineer"",""QA Lead"",""Scrum master"",""Software Architect"",""Software Developer"",""Software Development Manager"",""Tech lead"",""Tester"",""UI Designer"",""UX Designer""], ""series"" : [{""data"" : [21,35,29,12,12,6,24,21,6,15,17,23,22,24,20,20,19,8], ""label"" : ""Kunde Inc""},{""data"" : [18,27,17,17,17,8,12,18,5,7,9,13,14,12,17,16,20,6], ""label"" : ""Schulist LLC""},{""data"" : [13,38,30,10,10,6,9,13,9,18,7,21,19,9,22,26,8,3], ""label"" : ""Torp LLC""}]}";
        });

        app.MapGet(Urls.Chart2Url, [AllowAnonymous] (HttpResponse response) =>
        {
            response.ContentType = MediaTypeNames.Application.Json;
            return @"{""labels"" : [""2022"",""2021"",""2020"",""2019"",""2018"",""2017"",""2016"",""2015"",""2014"",""2013"",""2012""], ""series"" : [{""data"" : [123,120,114,110,112,113,113,103,96,87,80], ""label"" : ""Kunde Inc""},{""data"" : [97,93,96,98,96,92,90,85,82,77,73], ""label"" : ""Mante Inc""},{""data"" : [99,97,91,85,78,79,81,79,73,71,70], ""label"" : ""Mueller Inc""},{""data"" : [105,106,100,103,97,94,88,84,83,84,83], ""label"" : ""Schulist LLC""},{""data"" : [102,98,100,94,94,92,94,89,82,79,76], ""label"" : ""Torp LLC""}]}";
        });

        app.MapGet(Urls.Chart3Url, [AllowAnonymous] (HttpResponse response) =>
        {
            response.ContentType = MediaTypeNames.Application.Json;
            return @"{""labels"" : [""United States"", ""Denmark"", ""Hungary"", ""Portugal"", ""Belgium"", ""Luxembourg"", ""Austria"", ""Spain"", ""Ireland"", ""Other""], ""series"" : [{""data"" : [351, 22, 22, 21, 20, 20, 19, 18, 17, 469]}]}";
        });
    }
}