using EcommerceAPI.Data;
using EcommerceAPI.DTOs;
using EcommerceAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EcommerceAPI.Services;

public interface IAuthService
{
    Task<AuthResultDto> RegisterAsync(RegisterDto dto);
    Task<AuthResultDto> LoginAsync(LoginDto dto);
}

public class AuthService(AppDbContext db, IConfiguration config) : IAuthService
{
    public async Task<AuthResultDto> RegisterAsync(RegisterDto dto)
    {
        if (await db.Users.AnyAsync(u => u.Email == dto.Email))
            return new AuthResultDto(false, null, "Email already exists", null);

        var user = new User {
            FirstName = dto.FirstName, LastName = dto.LastName,
            Email = dto.Email, PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return new AuthResultDto(true, GenerateToken(user), null, user.Role);
    }

    public async Task<AuthResultDto> LoginAsync(LoginDto dto)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return new AuthResultDto(false, null, "Invalid credentials", null);
        return new AuthResultDto(true, GenerateToken(user), null, user.Role);
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[] {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };
        var token = new JwtSecurityToken(claims: claims,
            expires: DateTime.UtcNow.AddDays(7), signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public interface IProductService
{
    Task<PagedResult<Product>> GetAllAsync(string? category, string? search,
        decimal? minPrice, decimal? maxPrice, int page, int pageSize);
    Task<Product?> GetByIdAsync(int id);
    Task<Product> CreateAsync(CreateProductDto dto);
    Task<Product> UpdateAsync(int id, UpdateProductDto dto);
    Task DeleteAsync(int id);
    Task<IEnumerable<string>> GetCategoriesAsync();
}

public class ProductService(AppDbContext db) : IProductService
{
    public async Task<PagedResult<Product>> GetAllAsync(string? category, string? search,
        decimal? minPrice, decimal? maxPrice, int page, int pageSize)
    {
        var query = db.Products.Where(p => p.IsActive);
        if (!string.IsNullOrEmpty(category)) query = query.Where(p => p.Category == category);
        if (!string.IsNullOrEmpty(search))
            query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));
        if (minPrice.HasValue) query = query.Where(p => p.Price >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(p => p.Price <= maxPrice.Value);
        var total = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PagedResult<Product>(items, total, page, pageSize);
    }

    public async Task<Product?> GetByIdAsync(int id) =>
        await db.Products.FindAsync(id);

    public async Task<Product> CreateAsync(CreateProductDto dto)
    {
        var p = new Product { Name = dto.Name, Description = dto.Description,
            Price = dto.Price, Stock = dto.Stock, ImageUrl = dto.ImageUrl,
            Category = dto.Category, Brand = dto.Brand };
        db.Products.Add(p);
        await db.SaveChangesAsync();
        return p;
    }

    public async Task<Product> UpdateAsync(int id, UpdateProductDto dto)
    {
        var p = await db.Products.FindAsync(id) ?? throw new KeyNotFoundException();
        if (dto.Name is not null) p.Name = dto.Name;
        if (dto.Description is not null) p.Description = dto.Description;
        if (dto.Price.HasValue) p.Price = dto.Price.Value;
        if (dto.Stock.HasValue) p.Stock = dto.Stock.Value;
        if (dto.IsActive.HasValue) p.IsActive = dto.IsActive.Value;
        await db.SaveChangesAsync();
        return p;
    }

    public async Task DeleteAsync(int id)
    {
        var p = await db.Products.FindAsync(id) ?? throw new KeyNotFoundException();
        p.IsActive = false;
        await db.SaveChangesAsync();
    }

    public async Task<IEnumerable<string>> GetCategoriesAsync() =>
        await db.Products.Where(p => p.IsActive).Select(p => p.Category).Distinct().ToListAsync();
}
