using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatApp.Model
{
    public class User : IdentityUser
    {
        [StringLength(200)]
        public string? PhotoContentType { get; set; }
        public byte[]? PhotoData { get; set; }
        
        public List<Friend> Friends { get; set; } = new List<Friend>();

        [NotMapped]
        public virtual ICollection<Message> Messages { get; set;} = new HashSet<Message>();
    }
}
