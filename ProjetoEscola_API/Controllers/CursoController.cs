using Microsoft.AspNetCore.Mvc;
using ProjetoEscola_API.Data;
using ProjetoEscola_API.Models;

namespace ProjetoEscola_API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class CursoController : ControllerBase
    {
        private readonly EscolaContext? _context;

        public CursoController(EscolaContext context)
        {
            _context = context;
        }

        [ActionName("CursoTodos")]
        [HttpGet]
        public ActionResult<List<Curso>>? GetAll() {
            if (_context?.Curso != null)
                return _context.Curso.ToList();

            else return null;
        }

        [ActionName("CursoById")]
        [HttpGet()]
        public ActionResult<List<Aluno>> getById(int CursoId) {
            try {
                var result = _context.Curso.Where(c => c.id == CursoId);

                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            } catch (Exception e) {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
        }

        [ActionName("CursoNomes")]
        [HttpGet()]
        public ActionResult<List<Aluno>> getNomes() {
            try {
                var result = _context.Curso.GroupBy(c => c.nomeCurso)
                                            .Select(c => c.First())
                                            .ToList();
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            } catch (Exception e) {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
        }

        [ActionName("CursoId")]
        [HttpGet("{CursoId}")]
        public ActionResult<List<Aluno>> get(int CursoId) {
            try {
                var result = _context.Curso.Find(CursoId);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            } catch (Exception e) {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
        }

        [HttpPost]
        public async Task<ActionResult> post(Curso model) {
            try {
                _context.Curso.Add(model);
                if (await _context.SaveChangesAsync() == 1)
                    return Created($"/api/curso/{model.codCurso}", model);
            } catch (Exception e){
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
            return BadRequest();
        }

        [HttpPut("{CursoId}")]
        public async Task<ActionResult> put(int CursoId, Curso dadosCursoAlt) {
            try {
                var result = await _context.Curso.FindAsync(CursoId);
                if (CursoId != result.id) {
                    return BadRequest();
                }
                
                result.codCurso = dadosCursoAlt.codCurso;
                result.nomeCurso = dadosCursoAlt.nomeCurso;
                result.periodo = dadosCursoAlt.periodo;
                
                await _context.SaveChangesAsync();
                
                return Created($"/api/aluno/{dadosCursoAlt.codCurso}", dadosCursoAlt);
            } catch (Exception e){
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
        }

        [HttpDelete("{CursoId}")]
        public async Task<ActionResult> delete(int CursoId) {
            try {
                var curso = await _context.Curso.FindAsync(CursoId);
                if (curso == null) {
                    return NotFound();
                }
                _context.Remove(curso);
                await _context.SaveChangesAsync();
                return NoContent();
            } catch (Exception e){
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
        }
    }
}