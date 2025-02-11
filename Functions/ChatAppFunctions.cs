using ChatApp.Data;
using ChatApp.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;
using System.Runtime.InteropServices;

namespace ChatApp.Functions
{
    public class ChatAppFunctions
    {
        private readonly IRepository<User> _users;
        private readonly IRepository<Message> _messages;

        public ChatAppFunctions(IRepository<User> users, IRepository<Message> messages)
        {
            _users = users;
            _messages = messages;
        }

        public List<UserWithLastMessage> GetUserFriendsWithMessages(string userId)
        {
            var friends = _users.Table().Where(x => x.Id == userId)
                                        .Select(x => x.Friends)
                                        .FirstOrDefault()?
                                        .Take(10)
                                        .ToList();

            var www = _users.Table().Where(x => x.Id == userId)
                            .Select(x => x.Friends)
                            .FirstOrDefault();


            List<UserWithLastMessage> userWithLastMessages = new List<UserWithLastMessage>();
            friends?.ForEach(friend => {
                var message = GetLastMessage(userId, friend.Id);
                userWithLastMessages.Add(new UserWithLastMessage()
                {
                    Id = friend.Id,
                    Name = friend.Name,
                    Message = message,
                });
             });
                                            
            return userWithLastMessages;
        }

        public List<Message> GetChat(string from, string to, int skip)
        {
            var messages = _messages.Table()
                                    .Where(x => (x.From == from && x.To == to) || (x.From == to && x.To == from))
                                    .OrderByDescending(x => x.MessageSentAt)
                                    .Skip(skip)
                                    .Take(20)
                                    .OrderBy(x => x.MessageSentAt)
                                    .ToList();
            return messages;
        }

        public void AddFriend(string userId, string friendId)
        {
            var friend =_users.GetById(friendId);
            Friend newFriend = new Friend()
            {
                Id = friendId,
                Name = friend.UserName,
            };
            var user = _users.GetById(userId);
            if(user.Friends == null)
            {
                user.Friends = new List<Friend>();
            }
            user.Friends.Add(newFriend);
            _users.Update(user);
            _users.Save();
        }

        public List<User> GetUsers(string id)
        {
           User user = _users.GetById(id);
           return _users.Table().Where(x => !user.Friends.Select(x => x.Id).Contains(x.Id) && x.Id != user.Id).ToList();
        }

        public void AddMessage(MessageViewModel message)
        {
            Message entity = new Message();
            entity.To = message.To;
            entity.From = message.From;
            entity.MessageText = message.MessageText;
            entity.MessageSentAt = DateTime.Now;
            _messages.Insert(entity);
            _messages.Save();
        }


        private Message GetLastMessage(string from, string to)
        {
            var messages = _messages.Table()
                                    .Where(x => (x.From == from && x.To == to) || (x.From == to && x.To == from))
                                    .OrderByDescending(x => x.MessageSentAt)
                                    .FirstOrDefault();
            return messages;
        }
    }
}
