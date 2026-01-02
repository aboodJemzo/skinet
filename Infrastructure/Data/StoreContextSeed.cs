using System;
using System.Text.Json;
using Core.Entities;

namespace Infrastructure.Data;

public class StoreContextSeed
{
    public static async Task SeedAsync(StoreContext context)
    {
        if (!context.Products.Any())
        {
            var productData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/products.json");// to read for the file

            var products = JsonSerializer.Deserialize<List<Product>>(productData);// to convert from json to the type we want

            if (products == null)
                return;

            context.Products.AddRange(products); // here we used this method to add a punch of products at once

            await context.SaveChangesAsync();
        }

        if (!context.DeliveryMethods.Any())
        {
            var dmData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/delivery.json");// to read for the file

            var methods = JsonSerializer.Deserialize<List<DeliveryMethod>>(dmData);// to convert from json to the type we want

            if (methods == null)
                return;

            context.DeliveryMethods.AddRange(methods); // here we used this method to add a punch of products at once

            await context.SaveChangesAsync();
        }
    }
}
