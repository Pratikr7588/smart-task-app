namespace SmartTaskApp.Api.DTOs
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public int Importance { get; set; }
        public string RequiredEnergy { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public int SmartScore { get; set; }
    }

    public class CreateTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Importance { get; set; } = 5;
        public string RequiredEnergy { get; set; } = "Medium";
        public DateTime? DueDate { get; set; }
    }
}
