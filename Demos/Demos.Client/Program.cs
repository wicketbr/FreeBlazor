using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Radzen;

namespace Demos.Client
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebAssemblyHostBuilder.CreateDefault(args);

            builder.Services.AddRadzenComponents();

            await builder.Build().RunAsync();
        }
    }
}