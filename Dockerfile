# 1. Build React
FROM node:20 AS react-build
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/ ./
RUN npm run build  # This creates the /app/dist folder

# Stage 1: Build using the .NET 9 SDK
# WORKDIR /src : Sets the working directory inside the container to /src
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
# Copies only the .csproj file first (not all source code), Then restores NuGet dependencies
COPY ["backend/ShipmentManagement.API/*.csproj","ShipmentManagement.API/"]
COPY ["backend/ShipmentManagement.Application/*.csproj","ShipmentManagement.Application/"]
COPY ["backend/ShipmentManagement.Domain/*.csproj","ShipmentManagement.Domain/"]
COPY ["backend/ShipmentManagement.Infrastructure/*.csproj","ShipmentManagement.Infrastructure/"]
# Restore all dependencies
RUN dotnet restore "ShipmentManagement.API/ShipmentManagement.API.csproj"
# Now copies all remaining source files , then compiles the app in Release mode and outputs the result to /app/publish
COPY backend/ShipmentManagement.API/ ShipmentManagement.API/
COPY backend/ShipmentManagement.Application/ ShipmentManagement.Application/
COPY backend/ShipmentManagement.Domain/ ShipmentManagement.Domain/
COPY backend/ShipmentManagement.Infrastructure/ ShipmentManagement.Infrastructure/

RUN dotnet publish ./ShipmentManagement.API/ShipmentManagement.API.csproj -c Release -o /app/publish
# Pulls the official .NET 9 for runtime
# Sets working directory to /app
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
# Copies the compiled output from the build stage into this final image
# Nothing else from the build stage is carried over (no source code, no SDK)
COPY --from=build /app/publish .
# THIS LINE ADDS THE REACT FILES TO DOCKER:
# It takes the 'dist' folder from the first stage and puts it in 'wwwroot'
COPY --from=react-build /app/dist ./wwwroot
COPY frontend/src/config.json ./wwwroot/
#container listens on port 8080, This is informational only — the actual port mapping happens in docker run -p or docker-compose
EXPOSE 8080

ENTRYPOINT ["dotnet", "ShipmentManagement.API.dll"]