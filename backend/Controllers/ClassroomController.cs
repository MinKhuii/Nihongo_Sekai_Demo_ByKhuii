using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NihongoSekai.Data;
using NihongoSekai.Models;
using NihongoSekai.Models.DTOs;
using NihongoSekai.Services;
using System.Security.Claims;

namespace NihongoSekai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClassroomController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IVideoCallService _videoCallService;
        private readonly ILogger<ClassroomController> _logger;

        public ClassroomController(
            AppDbContext context, 
            IVideoCallService videoCallService,
            ILogger<ClassroomController> logger)
        {
            _context = context;
            _videoCallService = videoCallService;
            _logger = logger;
        }

        /// <summary>
        /// Get all classrooms with optional filtering
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ClassroomDto>>> GetClassrooms(
            [FromQuery] string? level = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12)
        {
            try
            {
                var query = _context.Classrooms
                    .Include(c => c.Partner)
                        .ThenInclude(p => p.Account)
                    .Include(c => c.Category)
                    .Where(c => c.Status == "Scheduled" || c.Status == "Live");

                // Apply filters
                if (!string.IsNullOrEmpty(level))
                    query = query.Where(c => c.Level == level);

                if (categoryId.HasValue)
                    query = query.Where(c => c.CategoryId == categoryId.Value);

                if (fromDate.HasValue)
                    query = query.Where(c => c.ScheduledAt >= fromDate.Value);

                if (toDate.HasValue)
                    query = query.Where(c => c.ScheduledAt <= toDate.Value);

                var totalCount = await query.CountAsync();
                var classrooms = await query
                    .OrderBy(c => c.ScheduledAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(c => new ClassroomDto
                    {
                        ClassroomId = c.ClassroomId,
                        Title = c.Title,
                        Description = c.Description,
                        Level = c.Level,
                        CategoryName = c.Category.Name,
                        TeacherName = $"{c.Partner.Account.FirstName} {c.Partner.Account.LastName}",
                        TeacherRating = c.Partner.Rating ?? 0,
                        MaxStudents = c.MaxStudents,
                        CurrentEnrollments = c.CurrentEnrollments,
                        Price = c.Price,
                        ScheduledAt = c.ScheduledAt,
                        Duration = c.Duration,
                        Status = c.Status,
                        CanJoin = false // Will be determined based on user enrollment
                    })
                    .ToListAsync();

                return Ok(new
                {
                    Data = classrooms,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving classrooms");
                return StatusCode(500, new { Message = "An error occurred while retrieving classrooms" });
            }
        }

        /// <summary>
        /// Get specific classroom details
        /// </summary>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ClassroomDetailDto>> GetClassroom(int id)
        {
            try
            {
                var classroom = await _context.Classrooms
                    .Include(c => c.Partner)
                        .ThenInclude(p => p.Account)
                    .Include(c => c.Category)
                    .Include(c => c.Enrollments)
                        .ThenInclude(e => e.Learner)
                            .ThenInclude(l => l.Account)
                    .FirstOrDefaultAsync(c => c.ClassroomId == id);

                if (classroom == null)
                    return NotFound(new { Message = "Classroom not found" });

                var currentUserId = GetCurrentUserId();
                var userRole = GetCurrentUserRole();
                var isEnrolled = false;
                var canJoin = false;

                if (currentUserId.HasValue && userRole == "Learner")
                {
                    var learner = await _context.Learners
                        .FirstOrDefaultAsync(l => l.Account.AccountId == currentUserId.Value);
                    
                    if (learner != null)
                    {
                        isEnrolled = classroom.Enrollments
                            .Any(e => e.LearnerId == learner.LearnerId);
                    }
                }

                var isTeacher = currentUserId.HasValue && 
                    classroom.Partner.Account.AccountId == currentUserId.Value;

                // Can join if: enrolled learner, classroom teacher, or admin
                canJoin = isEnrolled || isTeacher || userRole == "Admin";

                var classroomDetail = new ClassroomDetailDto
                {
                    ClassroomId = classroom.ClassroomId,
                    Title = classroom.Title,
                    Description = classroom.Description,
                    Level = classroom.Level,
                    CategoryName = classroom.Category.Name,
                    TeacherName = $"{classroom.Partner.Account.FirstName} {classroom.Partner.Account.LastName}",
                    TeacherBio = classroom.Partner.Bio,
                    TeacherRating = classroom.Partner.Rating ?? 0,
                    TeacherExperience = classroom.Partner.YearsOfExperience ?? 0,
                    MaxStudents = classroom.MaxStudents,
                    CurrentEnrollments = classroom.CurrentEnrollments,
                    Price = classroom.Price,
                    ScheduledAt = classroom.ScheduledAt,
                    Duration = classroom.Duration,
                    Status = classroom.Status,
                    IsEnrolled = isEnrolled,
                    CanJoin = canJoin,
                    EnrolledStudents = classroom.Enrollments.Select(e => new EnrolledStudentDto
                    {
                        StudentName = $"{e.Learner.Account.FirstName} {e.Learner.Account.LastName}",
                        EnrolledAt = e.EnrolledAt,
                        AttendanceStatus = e.AttendanceStatus
                    }).ToList()
                };

                return Ok(classroomDetail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving classroom {ClassroomId}", id);
                return StatusCode(500, new { Message = "An error occurred while retrieving classroom details" });
            }
        }

        /// <summary>
        /// Start video call for a classroom - SECURE ENDPOINT
        /// </summary>
        [HttpPost("{id}/start-call")]
        public async Task<ActionResult<VideoCallResponse>> StartVideoCall(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var userRole = GetCurrentUserRole();

                if (!currentUserId.HasValue)
                    return Unauthorized(new { Message = "User not authenticated" });

                var classroom = await _context.Classrooms
                    .Include(c => c.Partner)
                        .ThenInclude(p => p.Account)
                    .Include(c => c.Enrollments)
                        .ThenInclude(e => e.Learner)
                            .ThenInclude(l => l.Account)
                    .FirstOrDefaultAsync(c => c.ClassroomId == id);

                if (classroom == null)
                    return NotFound(new { Message = "Classroom not found" });

                // Validate user permissions
                var hasPermission = await ValidateVideoCallPermissions(classroom, currentUserId.Value, userRole);
                if (!hasPermission)
                    return Forbid("You don't have permission to start this video call");

                // Check if classroom is ready for video call
                if (classroom.Status == "Completed" || classroom.Status == "Cancelled")
                    return BadRequest(new { Message = "Cannot start video call for completed or cancelled classroom" });

                // Check timing - allow joining 15 minutes before scheduled time
                var allowedJoinTime = classroom.ScheduledAt.AddMinutes(-15);
                if (DateTime.UtcNow < allowedJoinTime)
                    return BadRequest(new { Message = $"Video call will be available from {allowedJoinTime:yyyy-MM-dd HH:mm} UTC" });

                // Generate or retrieve meeting URL
                var videoCallResponse = await _videoCallService.CreateOrGetMeeting(classroom);

                // Update classroom status if it's the teacher starting the call
                var isTeacher = classroom.Partner.Account.AccountId == currentUserId.Value;
                if (isTeacher && classroom.Status == "Scheduled")
                {
                    classroom.Status = "Live";
                    classroom.MeetingUrl = videoCallResponse.MeetingUrl;
                    classroom.MeetingId = videoCallResponse.MeetingId;
                    classroom.UpdatedAt = DateTime.UtcNow;
                    
                    await _context.SaveChangesAsync();
                    
                    _logger.LogInformation("Classroom {ClassroomId} status updated to Live by teacher {TeacherId}", 
                        id, classroom.Partner.PartnerId);
                }

                // Log the video call access
                await LogVideoCallAccess(currentUserId.Value, id, userRole);

                return Ok(videoCallResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error starting video call for classroom {ClassroomId}", id);
                return StatusCode(500, new { Message = "An error occurred while starting the video call" });
            }
        }

        /// <summary>
        /// Join existing video call
        /// </summary>
        [HttpPost("{id}/join-call")]
        public async Task<ActionResult<VideoCallResponse>> JoinVideoCall(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var userRole = GetCurrentUserRole();

                if (!currentUserId.HasValue)
                    return Unauthorized(new { Message = "User not authenticated" });

                var classroom = await _context.Classrooms
                    .Include(c => c.Partner)
                        .ThenInclude(p => p.Account)
                    .Include(c => c.Enrollments)
                        .ThenInclude(e => e.Learner)
                            .ThenInclude(l => l.Account)
                    .FirstOrDefaultAsync(c => c.ClassroomId == id);

                if (classroom == null)
                    return NotFound(new { Message = "Classroom not found" });

                // Validate user permissions
                var hasPermission = await ValidateVideoCallPermissions(classroom, currentUserId.Value, userRole);
                if (!hasPermission)
                    return Forbid("You don't have permission to join this video call");

                // Check if video call has been started
                if (string.IsNullOrEmpty(classroom.MeetingUrl))
                    return BadRequest(new { Message = "Video call has not been started yet" });

                if (classroom.Status != "Live")
                    return BadRequest(new { Message = "Video call is not currently active" });

                // Update enrollment attendance if user is a learner
                if (userRole == "Learner")
                {
                    var learner = await _context.Learners
                        .FirstOrDefaultAsync(l => l.Account.AccountId == currentUserId.Value);
                    
                    if (learner != null)
                    {
                        var enrollment = await _context.ClassroomEnrollments
                            .FirstOrDefaultAsync(e => e.ClassroomId == id && e.LearnerId == learner.LearnerId);
                        
                        if (enrollment != null)
                        {
                            enrollment.AttendanceStatus = "Attended";
                            enrollment.JoinedAt = DateTime.UtcNow;
                            await _context.SaveChangesAsync();
                        }
                    }
                }

                // Log the video call access
                await LogVideoCallAccess(currentUserId.Value, id, userRole);

                return Ok(new VideoCallResponse
                {
                    MeetingUrl = classroom.MeetingUrl,
                    MeetingId = classroom.MeetingId,
                    ClassroomTitle = classroom.Title,
                    TeacherName = $"{classroom.Partner.Account.FirstName} {classroom.Partner.Account.LastName}",
                    ScheduledAt = classroom.ScheduledAt,
                    Duration = classroom.Duration
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error joining video call for classroom {ClassroomId}", id);
                return StatusCode(500, new { Message = "An error occurred while joining the video call" });
            }
        }

        /// <summary>
        /// End video call (teacher only)
        /// </summary>
        [HttpPost("{id}/end-call")]
        public async Task<ActionResult> EndVideoCall(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var userRole = GetCurrentUserRole();

                if (!currentUserId.HasValue)
                    return Unauthorized(new { Message = "User not authenticated" });

                var classroom = await _context.Classrooms
                    .Include(c => c.Partner)
                        .ThenInclude(p => p.Account)
                    .FirstOrDefaultAsync(c => c.ClassroomId == id);

                if (classroom == null)
                    return NotFound(new { Message = "Classroom not found" });

                // Only teacher or admin can end the call
                var isTeacher = classroom.Partner.Account.AccountId == currentUserId.Value;
                if (!isTeacher && userRole != "Admin")
                    return Forbid("Only the teacher or admin can end the video call");

                // Update classroom status
                classroom.Status = "Completed";
                classroom.UpdatedAt = DateTime.UtcNow;

                // Update all enrolled students to "Absent" if they haven't joined
                var enrollments = await _context.ClassroomEnrollments
                    .Where(e => e.ClassroomId == id && e.AttendanceStatus == "Registered")
                    .ToListAsync();

                foreach (var enrollment in enrollments)
                {
                    enrollment.AttendanceStatus = "Absent";
                }

                await _context.SaveChangesAsync();

                // Notify video call service to end the meeting
                await _videoCallService.EndMeeting(classroom.MeetingId);

                _logger.LogInformation("Video call ended for classroom {ClassroomId} by user {UserId}", 
                    id, currentUserId.Value);

                return Ok(new { Message = "Video call ended successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error ending video call for classroom {ClassroomId}", id);
                return StatusCode(500, new { Message = "An error occurred while ending the video call" });
            }
        }

        #region Private Helper Methods

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : null;
        }

        private string GetCurrentUserRole()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value ?? "";
        }

        private async Task<bool> ValidateVideoCallPermissions(Classroom classroom, int userId, string userRole)
        {
            // Admin can always join
            if (userRole == "Admin")
                return true;

            // Teacher can join their own classroom
            if (userRole == "Partner" && classroom.Partner.Account.AccountId == userId)
                return true;

            // Learner can join if enrolled
            if (userRole == "Learner")
            {
                var learner = await _context.Learners
                    .FirstOrDefaultAsync(l => l.Account.AccountId == userId);
                
                if (learner != null)
                {
                    var isEnrolled = await _context.ClassroomEnrollments
                        .AnyAsync(e => e.ClassroomId == classroom.ClassroomId && e.LearnerId == learner.LearnerId);
                    
                    return isEnrolled;
                }
            }

            return false;
        }

        private async Task LogVideoCallAccess(int userId, int classroomId, string userRole)
        {
            try
            {
                // This could be logged to a separate audit table or logging service
                _logger.LogInformation("User {UserId} with role {Role} accessed video call for classroom {ClassroomId}", 
                    userId, userRole, classroomId);
                
                // Add to admin logs if needed
                var adminLog = new AdminLog
                {
                    AdminId = userRole == "Admin" ? userId : 1, // Default to system admin if not admin user
                    Action = "VIDEO_CALL_ACCESS",
                    TargetType = "Classroom",
                    TargetId = classroomId,
                    Details = $"{{\"userId\": {userId}, \"role\": \"{userRole}\", \"action\": \"video_call_access\"}}",
                    IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                    UserAgent = HttpContext.Request.Headers["User-Agent"].ToString(),
                    CreatedAt = DateTime.UtcNow
                };

                _context.AdminLogs.Add(adminLog);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging video call access");
                // Don't throw - logging failure shouldn't break the main flow
            }
        }

        #endregion
    }
}
