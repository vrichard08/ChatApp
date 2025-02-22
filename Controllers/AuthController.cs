﻿using ChatApp.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace M7CarManager.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public AuthController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var claim = new List<Claim>
                { 
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
                };
                foreach (var role in await _userManager.GetRolesAsync(user))
                {
                    claim.Add(new Claim(ClaimTypes.Role, role));
                }
                var signinKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("nagyonhosszutitkoskodhelye"));
                var token = new JwtSecurityToken(
                 issuer: "http://www.security.org", audience: "http://www.security.org",
                 claims: claim, expires: DateTime.Now.AddMinutes(60),
                 signingCredentials: new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256)
                );
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    user = user.Id,
                    expiration = token.ValidTo
                });
            }
            return Unauthorized();
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Validation failed",
                    errors = ModelState.Values
                                .SelectMany(v => v.Errors)
                                .Select(e => e.ErrorMessage)
                });
            }

            var user = new User
            {
                Email = model.Email,
                UserName = model.UserName,
                SecurityStamp = Guid.NewGuid().ToString(),
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    message = "User creation failed",
                    errors = result.Errors.Select(e => e.Description)
                });
            }

            await _userManager.AddToRoleAsync(user, "user");
            return Ok(new
            {
                message = "Registration was successful!"
            });
        }

        [Authorize]
        [Route("[action]")]
        [HttpGet]
        public async Task<IActionResult> GetUserInfos()
        {
            var user = _userManager.Users.FirstOrDefault(t => t.UserName == this.User.Identity.Name);
            if (user != null)
            {
                return Ok(new
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    PhotoData = user.PhotoData,
                    PhotoContentType = user.PhotoContentType,
                    Roles = await _userManager.GetRolesAsync(user)
                });
            }
            return Unauthorized();
        }

        [Authorize]
        [Route("[action]")]
        [HttpDelete]
        public async Task<IActionResult> DeleteMyself()
        {
            var user = _userManager.Users.FirstOrDefault(t => t.UserName == this.User.Identity.Name);
            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest();
        }

        [Route("[action]")]
        [HttpPost]
        public async Task<IActionResult> Update([FromBody] RegisterViewModel model)
        {
            var user = _userManager.Users.FirstOrDefault(t => t.UserName == this.User.Identity.Name);
            user.Email = model.Email;
            user.UserName = model.UserName;
            if (!(model.Password == null || model.Password.Length == 0))
            {
                await _userManager.RemovePasswordAsync(user);
                await _userManager.AddPasswordAsync(user, model.Password);
            }
            await _userManager.UpdateAsync(user);
            return Ok();
        }

        //[Route("[action]")]
        //[HttpPost]
        //public async Task<IActionResult> Microsoft([FromBody] SocialToken token)
        //{
        //    HttpClient client = new HttpClient();
        //    client.BaseAddress = new Uri("https://graph.microsoft.com");
        //    client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        //    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token.Token);
        //    var response = await client.GetAsync("/oidc/userinfo");
        //    MsModel? userInfo = new MsModel();
        //    if (response.IsSuccessStatusCode)
        //    {
        //        userInfo = await response.Content.ReadFromJsonAsync<MsModel>();
        //        User user = new User
        //        {
        //            Email = userInfo.email,
        //            UserName = userInfo.email,
        //            EmailConfirmed = true
        //        };
        //        return await SocialAuth(user);
        //    }
        //    return BadRequest(new ErrorModel() { Message = "Ms login failed" });
        //}


        //[Route("[action]")]
        //[HttpPost]
        //public async Task<IActionResult> Facebook([FromBody] SocialToken token)
        //{
        //    HttpClient client = new HttpClient();
        //    client.BaseAddress = new Uri("https://graph.facebook.com");
        //    client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        //    var response = await client.GetAsync($"me?fields=first_name,last_name,picture,email&access_token={token.Token}");
        //    var result = await response.Content.ReadFromJsonAsync<FbModel>();
        //    if (result != null)
        //    {
        //        AppUser user = new AppUser
        //        {
        //            FirstName = result.last_name,
        //            LastName = result.first_name,
        //            Email = result.email,
        //            UserName = result.email,
        //        };

        //        return await SocialAuth(user);
        //    }
        //    return Unauthorized();
        //}


        //[Route("[action]")]
        //[HttpPost]
        //public async Task<IActionResult> Google([FromBody] SocialToken token)
        //{
        //    HttpClient client = new HttpClient();
        //    client.BaseAddress = new Uri("https://oauth2.googleapis.com");
        //    client.DefaultRequestHeaders.Accept.Add(
        //      new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        //    var response = await client.GetAsync($"tokeninfo?id_token={token.Token}");
        //    var result = await response.Content.ReadFromJsonAsync<GoogleModel>();

        //    if (result != null)
        //    {
        //        AppUser user = new AppUser
        //        {
        //            FirstName = result.given_name,
        //            LastName = result.family_name,
        //            Email = result.email,
        //            UserName = result.email,
        //        };
        //        return await SocialAuth(user);
        //    }
        //    return Unauthorized();
        //}



        //private async Task<IActionResult> SocialAuth(User user)
        //{
        //    if (_userManager.Users.FirstOrDefault(t => t.Email == user.Email) == null)
        //    {
        //        var res = await _userManager.CreateAsync(user);
        //        if (res.Succeeded)
        //        {
        //            await _userManager.AddToRoleAsync(user, "Customer");
        //        }
        //    }
        //    var appuser = _userManager.Users.FirstOrDefault(t => t.Email == user.Email);
        //    if (appuser != null)
        //    {
        //        var claim = new List<Claim> {
        //  new Claim(JwtRegisteredClaimNames.Sub, appuser.UserName),
        //  new Claim(JwtRegisteredClaimNames.NameId, appuser.UserName),
        //  new Claim(JwtRegisteredClaimNames.Name, appuser.UserName)
        //};

        //        foreach (var role in await _userManager.GetRolesAsync(appuser))
        //        {
        //            claim.Add(new Claim(ClaimTypes.Role, role));
        //        }
        //        var signinKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes
        //    ("nagyonhosszutitkoskodhelye"));
        //        var token = new JwtSecurityToken(
        //         issuer: "http://www.security.org", audience: "http://www.security.org",
        //         claims: claim, expires: DateTime.Now.AddMinutes(60),
        //         signingCredentials: new SigningCredentials
        //    (signinKey, SecurityAlgorithms.HmacSha256)
        //        );

        //        return Ok(new
        //        {
        //            token = new JwtSecurityTokenHandler().WriteToken(token),
        //            expiration = token.ValidTo
        //        });
        //    }
        //    return Unauthorized();
        //}



    }


    internal class MsModel
    {
        public string given_name { get; set; }
        public string family_name { get; set; }
        public string email { get; set; }
    }

    public class SocialToken
    {
        public string Token { get; set; }
    }

    public class FbModel
    {
        public string first_name { get; set; }
        public string last_name { get; set; }
        public Picture picture { get; set; }
        public string email { get; set; }
        public string id { get; set; }
        public class Picture
        {
            public PictureData data { get; set; }
            public class PictureData
            {
                public int height { get; set; }
                public bool is_silhouette { get; set; }
                public string url { get; set; }
                public int width { get; set; }
            }
        }
    }

    public class GoogleModel
    {
        public string iss { get; set; }
        public string azp { get; set; }
        public string aud { get; set; }
        public string sub { get; set; }
        public string email { get; set; }
        public string email_verified { get; set; }
        public string at_hash { get; set; }
        public string name { get; set; }
        public string picture { get; set; }
        public string given_name { get; set; }
        public string family_name { get; set; }
        public string locale { get; set; }
        public string iat { get; set; }
        public string exp { get; set; }
        public string jti { get; set; }
        public string alg { get; set; }
        public string kid { get; set; }
        public string typ { get; set; }
    }




}
