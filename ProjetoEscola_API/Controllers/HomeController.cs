using Microsoft.AspNetCore.Mvc;
using ProjetoEscola_API.Data;
using ProjetoEscola_API.Models;

namespace ProjetoEscola_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlunoController : ControllerBase
    {
        private readonly EscolaContext? _context;

        public AlunoController(EscolaContext context)
        {
            _context = context;
        }
        [HttpGet]
        public ActionResult<List<Aluno>>? GetAll() {
            if (_context?.Aluno != null)
                return _context.Aluno.ToList();

            else return null;
        }

        [HttpGet("{AlunoId}")]
        public ActionResult<List<Aluno>> Get(int AlunoId) {
            try {
                var result = _context?.Aluno?.Find(AlunoId);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            } catch {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
        }

        [HttpPost]
        public async Task<ActionResult> post(Aluno model) {
            try {
                if (await _context.SaveChangesAsync() == 1)
                    return Created("$/api/aluno/{model.RA}", model);
            } catch {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
            return BadRequest();
        }

        [HttpPut("{AlunoId}")]
        public async Task<ActionResult> put(int AlunoId, Aluno dadosAlunoAlt) {
            try {
                var result = await _context.Aluno.FindAsync(AlunoId);
                if (AlunoId != result.id) {
                    return BadRequest();
                }
                result.ra = dadosAlunoAlt.ra;
                result.nome = dadosAlunoAlt.nome;
                result.codCurso = dadosAlunoAlt.codCurso;
                await _context.SaveChangesAsync();
                return Created($"/api/aluno/{dadosAlunoAlt}", dadosAlunoAlt);
            } catch {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
        }

        [HttpDelete("{AlunoId}")]
        public async Task<ActionResult> delete(int AlunoId) {
            try {
                var aluno = await _context!.Aluno!  .FindAsync(AlunoId);
                if (aluno == null) {
                    return NotFound();
                }
                _context.Remove(AlunoId);
                await _context.SaveChangesAsync();
                return NoContent();
            } catch {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
        }
    }
}