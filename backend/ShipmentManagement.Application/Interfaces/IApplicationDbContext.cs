using Microsoft.EntityFrameworkCore;
using ShipmentManagement.Domain.Entities;

namespace ShipmentManagement.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
