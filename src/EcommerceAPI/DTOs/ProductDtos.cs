namespace EcommerceAPI.DTOs;

public record CreateProductDto(string Name, string Description, decimal Price,
    int Stock, string ImageUrl, string Category, string Brand);
public record UpdateProductDto(string? Name, string? Description, decimal? Price,
    int? Stock, string? ImageUrl, bool? IsActive);
public record RegisterDto(string FirstName, string LastName, string Email, string Password);
public record LoginDto(string Email, string Password);
public record AuthResultDto(bool Success, string? Token, string? Message, string? Role);
public record CreateOrderDto(string ShippingAddress, List<OrderItemDto> Items);
public record OrderItemDto(int ProductId, int Quantity);
public record PagedResult<T>(IEnumerable<T> Items, int TotalCount, int Page, int PageSize);
