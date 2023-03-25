#
# This Dockerfile is used to build a demo application for the RazorSvelte project.
# To run the demo application, you need to have Docker installed on your machine.
# You can download Docker Desktop from https://www.docker.com/products/docker-desktop
#
# Follow these steps to build and run the RazorSvelte demo application:
# 1. Download the Dockerfile from https://github.com/vb-consulting/RazorSvelte/blob/master/Dockerfile 
# (or just run wget https://github.com/vb-consulting/RazorSvelte/blob/master/Dockerfile from the command prompt)
#
# 2. Open a command prompt and navigate to the folder where you saved the Dockerfile
#
# 3. Run the following commands:
#
# docker build -t razorsvelte .
# docker run --rm -it -p 5000:80 --name razorsvelte razorsvelte:latest
#
# 4. Navigate to http://localhost:5000/
#
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
RUN git clone https://github.com/vb-consulting/RazorSvelte
WORKDIR "/RazorSvelte/RazorSvelte"
RUN dotnet restore
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RazorSvelte.dll"]
