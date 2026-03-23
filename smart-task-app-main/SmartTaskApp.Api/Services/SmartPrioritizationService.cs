using SmartTaskApp.Api.Models;

namespace SmartTaskApp.Api.Services
{
    public interface ISmartPrioritizationService
    {
        void CalculateAndSetScore(SmartTask task);
        IQueryable<SmartTask> SortBySmartScore(IQueryable<SmartTask> tasks);
    }

    public class SmartPrioritizationService : ISmartPrioritizationService
    {
        public void CalculateAndSetScore(SmartTask task)
        {
            // Base score comes from Importance (1-10)
            int score = task.Importance * 10;
            
            // Due Date Modifier
            if (task.DueDate.HasValue)
            {
                var daysUntilDue = (task.DueDate.Value.Date - DateTime.UtcNow.Date).TotalDays;
                
                if (daysUntilDue < 0)
                {
                    // Overdue tasks get a massive bump
                    score += 50; 
                }
                else if (daysUntilDue == 0)
                {
                    // Due today
                    score += 40;
                }
                else if (daysUntilDue <= 2)
                {
                    // Due soon
                    score += 20;
                }
                else if (daysUntilDue <= 7)
                {
                    // Due this week
                    score += 10;
                }
            }

            // Energy Level Modifier (Prioritize high energy tasks if you have the energy, but generally they are heavier)
            if (task.RequiredEnergy.Equals("High", StringComparison.OrdinalIgnoreCase))
            {
                score += 5; // Slight bump for difficult things so they aren't ignored
            }

            // Cap the score at 100
            task.SmartScore = Math.Min(100, Math.Max(0, score));
        }

        public IQueryable<SmartTask> SortBySmartScore(IQueryable<SmartTask> tasks)
        {
            return tasks
                .OrderBy(t => t.IsCompleted)  // Incomplete tasks first (false before true)
                .ThenByDescending(t => t.SmartScore)  // Sort by smart score descending
                .ThenBy(t => t.DueDate);  // Then by due date
        }
    }
}
