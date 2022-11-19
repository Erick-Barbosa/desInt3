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

        [ActionName("CursoByNomeAndPeriodo")]
        [HttpGet("{curso}/{periodo}")]
        public ActionResult<List<Curso>> getByNomeAndPeriodo(string curso, string periodo) {
            try {
                var result = 
                    _context.Curso.Where(
                                        c => c.nomeCurso == curso
                                    ).Where(
                                        c => c.periodo == periodo
                                    );

                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            } catch (Exception e) {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
        }

        [ActionName("CursoByCod")]
        [HttpGet("{cursoCod}")]
        public ActionResult<List<Curso>> get(int cursoCod) {
            try {
                var result = _context.Curso.Where(c => c.codCurso == cursoCod);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            } catch (Exception e) {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
        }

        [ActionName("CursoByNome")]
        [HttpGet("{cursoNome}")]
        public ActionResult<List<Curso>> getByNome(string nomeCurso) {
            try {
                var result = _context.Curso.Where(c => c.nomeCurso == nomeCurso);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            } catch (Exception e) {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
        }

        [ActionName("Post")]
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

        [ActionName("Put")]
        [HttpPut("{CursoId}")]
        public async Task<ActionResult> put(int cursoId, Curso dadosCursoAlt) {
            try {
                var result = await _context.Curso.FindAsync(cursoId);
                if (cursoId != result.id) {
                    return BadRequest();
                }
                
                result.codCurso = dadosCursoAlt.codCurso;
                result.nomeCurso = dadosCursoAlt.nomeCurso;
                result.periodo = dadosCursoAlt.periodo;
                
                await _context.SaveChangesAsync();
                
                return Created($"/api/curso/{dadosCursoAlt.codCurso}", dadosCursoAlt);
            } catch (Exception e){
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Falha no acesso ao banco de dados");
            }
        }

        [ActionName("Delete")]
        [HttpDelete("{CursoId}")]
        public async Task<ActionResult> delete(int cursoId) {
            try {
                var curso = await _context.Curso.FindAsync(cursoId);
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