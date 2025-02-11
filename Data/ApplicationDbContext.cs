using ChatApp.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace ChatApp.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {

        public DbSet<User> Products { get; set; }
        public DbSet<Message> Messages { get; set; }
        

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {

           

            builder.Entity<User>(user => user
                        .HasMany(user => user.Messages)
                        .WithOne(message => message.User)
                        .HasForeignKey(message => message.From)
                        .OnDelete(DeleteBehavior.Cascade));

            builder.Entity<User>()
                        .Property(u => u.Friends)
                        .HasConversion(
                            v => JsonConvert.SerializeObject(v, Formatting.None), 
                            v => JsonConvert.DeserializeObject<List<Friend>>(v) ?? new List<Friend>()) 
                        .HasColumnType("nvarchar(max)");

            builder.Entity<IdentityRole>().HasData(
             new { Id = "1", Name = "Admin", NormalizedName = "ADMIN" },
             new { Id = "2", Name = "Customer", NormalizedName = "USER" }
           );

            base.OnModelCreating(builder);


        }
    }
}
