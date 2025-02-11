namespace ChatApp.Model
{
    public class UserWithLastMessage
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Message Message { get; set; }
    }
}
