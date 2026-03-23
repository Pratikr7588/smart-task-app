using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartTaskApp.Api.Data;
using SmartTaskApp.Api.DTOs;
using SmartTaskApp.Api.Models;
using SmartTaskApp.Api.Services;

namespace SmartTaskApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ISmartPrioritizationService _prioritizationService;

        public TasksController(ApplicationDbContext context, ISmartPrioritizationService prioritizationService)
        {
            _context = context;
            _prioritizationService = prioritizationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks([FromQuery] string? energyFilter = null)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var query = _context.SmartTasks.Where(t => t.UserId == userId);

            // Optional energy filter
            if (!string.IsNullOrEmpty(energyFilter))
            {
                query = query.Where(t => t.RequiredEnergy.ToLower() == energyFilter.ToLower());
            }

            var sortedTasks = await _prioritizationService.SortBySmartScore(query).ToListAsync();

            return Ok(sortedTasks.Select(MapToDto));
        }

        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskDto dto)
        {
            var task = new SmartTask
            {
                Title = dto.Title,
                Description = dto.Description,
                Importance = dto.Importance,
                RequiredEnergy = dto.RequiredEnergy,
                DueDate = dto.DueDate,
                UserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)
            };

            _prioritizationService.CalculateAndSetScore(task);

            _context.SmartTasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTasks), new { id = task.Id }, MapToDto(task));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TaskDto>> UpdateTask(int id, CreateTaskDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var task = await _context.SmartTasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null)
                return NotFound(new { message = "Task not found" });

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.Importance = dto.Importance;
            task.RequiredEnergy = dto.RequiredEnergy;
            task.DueDate = dto.DueDate;

            _prioritizationService.CalculateAndSetScore(task);
            await _context.SaveChangesAsync();

            return Ok(MapToDto(task));
        }

        [HttpPatch("{id}/complete")]
        public async Task<ActionResult<TaskDto>> ToggleComplete(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var task = await _context.SmartTasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null)
                return NotFound(new { message = "Task not found" });

            task.IsCompleted = !task.IsCompleted;
            await _context.SaveChangesAsync();

            return Ok(MapToDto(task));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<object>> DeleteTask(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var task = await _context.SmartTasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (task == null)
                return NotFound(new { message = "Task not found" });

            _context.SmartTasks.Remove(task);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Task deleted successfully" });
        }

        private static TaskDto MapToDto(SmartTask task)
        {
            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                IsCompleted = task.IsCompleted,
                Importance = task.Importance,
                RequiredEnergy = task.RequiredEnergy,
                DueDate = task.DueDate,
                SmartScore = task.SmartScore
            };
        }
    }
}
