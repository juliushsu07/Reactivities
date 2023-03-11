using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
[ApiController]
[Route("api/[controller]")] // localhost:5000/weatherforecast
    public class BaseAPIController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= 
            HttpContext.RequestServices.GetService<IMediator>();
    }
}