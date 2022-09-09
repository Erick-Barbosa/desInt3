using Microsoft.AspNetCore.Mvc;
using ProjetoEscola_API.Data;
using ProjetoEscola_API.Models;

namespace ProjetoEscola_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlunoController : ControllerBase
    {
        private EscolaContext? _context;

        public AlunoController(EscolaContext context)
        {
            _context = context;
        }
        public ActionResult<List<Aluno>>? GetAll() {
            if(_context?.Aluno != null)
                return _context.Aluno.ToList();

            else return null;
        }
    }
}