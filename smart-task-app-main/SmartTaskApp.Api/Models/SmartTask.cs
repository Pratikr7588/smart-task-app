using System;

namespace SmartTaskApp.Api.Models
{
    public class SmartTask
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        public bool IsCompleted { get; set; } = false;
        
        // Eisenhower matrix factors (1-10)
        public int Importance { get; set; } = 5; 
        
        // Energy/Context requirements (e.g. "High", "Low", "Focus")
        public string RequiredEnergy { get; set; } = "Medium";
        
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign keys
        public int UserId { get; set; }
        public User? User { get; set; }
        
        // Auto-calculated score property based on Importance + Due Date proximity
        public int SmartScore { get; set; }
    }
}
