using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatApp.Model
{
    public class Message
    {
        [Key]
        public string Id { get; set; }  =  Guid.NewGuid().ToString();
        public string From { get; set; }
        public string To { get; set; }
        public string MessageText { get; set; }
        public DateTime MessageSentAt { get; set; }
        [NotMapped]
        public virtual User User { get; set; }
    }
}
