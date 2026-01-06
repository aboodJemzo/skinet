using System;
using Core.Entities;

namespace Core.Interfaces;

public interface IUnitOfWork : IDisposable // this means is that when we implement our IUnitOfWork interface we have to implement the Dispose method from IDisposable
{
    IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;
    Task<bool> Complete();
}
