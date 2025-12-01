using System;
using Core.Entities;

namespace Core.Specifications;

public class BrandListSpecification : BaseSpecification<Product, string> // here it takes product and returns string
{
    public BrandListSpecification()
    {
        AddSelect(x => x.Brand);
        ApplyDistinct();
    }
}
