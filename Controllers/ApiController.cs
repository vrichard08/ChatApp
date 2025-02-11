using ChatApp.Functions;
using ChatApp.Model;
using Microsoft.AspNetCore.Mvc;
using NuGet.Common;


namespace ChatApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApiController : ControllerBase
    {
        private readonly ChatAppFunctions _functions;

        public ApiController(ChatAppFunctions functions)
        {
            _functions = functions;
        }

        [HttpGet]
        [Route("[action]")]
        public JsonResult GetUserFriendsWithMessages(string userId)
        {
            var result = _functions.GetUserFriendsWithMessages(userId);
            return  new JsonResult(result);
        }
        [HttpGet]
        [Route("[action]")]
        public JsonResult GetChat(string from , string to, int skip )
        { 
            var result = _functions.GetChat(from, to, skip);
            return new JsonResult(result);
        }

        [HttpPost]
        [Route("[action]")]
        public  IActionResult AddFriend(FriendViewModel model)
        {
              _functions.AddFriend(model.UserId, model.FriendId);
               return Ok(new {
                message = "Friend added successfully!"
               });
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMessage(MessageViewModel message)
        {
            _functions.AddMessage(message);
            return Ok(new
            {
                message = "Message saved to database successfully!"
            });
        }

        [HttpGet]
        [Route("[action]")]
        public JsonResult GetUsers(string userId)
        {
            var result = _functions.GetUsers(userId);
            return new JsonResult(result);
        }
    }
}
