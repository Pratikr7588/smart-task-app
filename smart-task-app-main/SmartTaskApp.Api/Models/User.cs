using System;
using System.Collections.Generic;

namespace SmartTaskApp.Api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        
        // Navigation properties
        public ICollection<SmartTask> Tasks { get; set; } = new List<SmartTask>();
    }
}
