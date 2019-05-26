FROM microsoft/dotnet:2.2-sdk AS build-env
WORKDIR /app
COPY apifood.WebApi.csproj .
COPY . .
RUN dotnet publish -c Release -o /publish

FROM microsoft/dotnet:2.2-aspnetcore-runtime AS runtime-env
WORKDIR /publish
EXPOSE 5000
COPY --from=build-env /publish .
ENTRYPOINT [ "dotnet","apifood.WebApi.dll" ]